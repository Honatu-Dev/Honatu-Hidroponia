# Plan de solución: inscripciones duplicadas y race condition en talleres

> Fecha: 2026-10-01  
> Tipo: hotfix backend + DB  
> Prioridad: 🔴 permite múltiples inscripciones al hacer click repetido; además la tabla puede quedar sobreinscrita por concurrencia.

---

## 1. Síntomas observados

1. Al inscribirse a un taller como invitado/guest, el usuario no recibió feedback visual inmediato y clickeó varias veces. Resultado: se crearon **5 filas idénticas** en `WorkshopEnrollments`.
2. El endpoint `POST /api/workshops/enroll` no tenía transacción ni `SELECT ... FOR UPDATE`, por lo que múltiples requests concurrentes podrían superar el cupo del taller.
3. No existían constraints únicos para impedir que un mismo usuario o correo guest se inscribiera más de una vez al mismo taller.

> Nota: el error previo `column "guestName" does not exist` ya no aplica. Las columnas `guestName`, `guestEmail`, `guestPhone` existen ahora en la base remota (`dbHonatu` en `108.175.7.88`).

## 2. Causa raíz

- **Frontend**: el botón de inscripción no se deshabilita durante el envío. El usuario no ve feedback de carga y repite el click.
- **Backend**: `enrollWorkshop` hace `count()` + `create()` sin transacción ni lock. Es posible:
  - Duplicados si el usuario hace varios clicks.
  - Sobreinscripción si varias requests llegan casi al mismo tiempo.
- **Base de datos**: faltan índices únicos parciales sobre `(workshopId, userId)` y `(workshopId, guestEmail)`.

## 3. Cambios ya aplicados en código (por Devin)

### 3.1 Backend (`backend/src/controllers/workshops.controller.js`)

- `enrollWorkshop` ahora corre dentro de `sequelize.transaction()`.
- Se bloquea la fila del taller con `lock: transaction.LOCK.UPDATE` antes de contar inscritos.
- El conteo de cupo y la creación de la inscripción ocurren dentro de la misma transacción.
- Se normaliza `guestEmail` a minúsculas y trim.
- Se captura `SequelizeUniqueConstraintError` / código `23505` y se devuelve `400` con mensaje claro.

### 3.2 Esquema (`backend/schema.sql`)

Añadidos partial unique indexes en la definición de `WorkshopEnrollments`:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS "idx_workshop_enrollment_user"
  ON "WorkshopEnrollments" ("workshopId", "userId")
  WHERE "userId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_workshop_enrollment_guest"
  ON "WorkshopEnrollments" ("workshopId", "guestEmail")
  WHERE "guestEmail" IS NOT NULL;
```

### 3.3 Frontend (`frontend/src/js/controllers/workshops.controller.js`)

- El submit handler del formulario de inscripción ahora:
  - Deshabilita el botón de envío.
  - Cambia su texto a `"Procesando..."`.
  - Lo rehabilita en `finally` (éxito o error).
- Esto evita clics múltiles accidentales.

## 4. Script para aplicar en la base de datos existente

La base remota (`dbHonatu` en `108.175.7.88`) ya tiene filas duplicadas. Antes de crear los índices únicos es necesario **eliminar duplicados**, de lo contrario `CREATE UNIQUE INDEX` fallará.

### 4.1 Deduplicar inscripciones (preservar la más antigua)

Conectarse a la base remota y ejecutar:

```sql
-- Eliminar duplicados de usuario logueado (mantener el registro más antiguo)
DELETE FROM "WorkshopEnrollments" e
WHERE e."userId" IS NOT NULL
  AND e.id NOT IN (
    SELECT id FROM (
      SELECT id,
        ROW_NUMBER() OVER (
          PARTITION BY "workshopId", "userId"
          ORDER BY "createdAt" ASC, id ASC
        ) AS rn
      FROM "WorkshopEnrollments"
      WHERE "userId" IS NOT NULL
    ) ranked
    WHERE rn = 1
  );

-- Eliminar duplicados de invitados (mantener el registro más antiguo)
DELETE FROM "WorkshopEnrollments" e
WHERE e."guestEmail" IS NOT NULL
  AND e.id NOT IN (
    SELECT id FROM (
      SELECT id,
        ROW_NUMBER() OVER (
          PARTITION BY "workshopId", "guestEmail"
          ORDER BY "createdAt" ASC, id ASC
        ) AS rn
      FROM "WorkshopEnrollments"
      WHERE "guestEmail" IS NOT NULL
    ) ranked
    WHERE rn = 1
  );
```

### 4.2 Crear índices únicos

```sql
CREATE UNIQUE INDEX IF NOT EXISTS "idx_workshop_enrollment_user"
  ON "WorkshopEnrollments" ("workshopId", "userId")
  WHERE "userId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_workshop_enrollment_guest"
  ON "WorkshopEnrollments" ("workshopId", "guestEmail")
  WHERE "guestEmail" IS NOT NULL;
```

> Importante: si aún faltan las columnas `guestName`/`guestEmail`/`guestPhone` en la base remota (por si se aplicó el ALTER en otra BD), agregarlas primero:
> ```sql
> ALTER TABLE "WorkshopEnrollments"
>   ADD COLUMN IF NOT EXISTS "guestName" VARCHAR(255),
>   ADD COLUMN IF NOT EXISTS "guestEmail" VARCHAR(255),
>   ADD COLUMN IF NOT EXISTS "guestPhone" VARCHAR(50);
> ```

## 5. Verificación

1. Revisar que no queden duplicados:
   ```sql
   SELECT "workshopId", "userId", COUNT(*) 
   FROM "WorkshopEnrollments"
   WHERE "userId" IS NOT NULL
   GROUP BY "workshopId", "userId"
   HAVING COUNT(*) > 1;

   SELECT "workshopId", "guestEmail", COUNT(*)
   FROM "WorkshopEnrollments"
   WHERE "guestEmail" IS NOT NULL
   GROUP BY "workshopId", "guestEmail"
   HAVING COUNT(*) > 1;
   ```

2. Probar doble click en el botón de inscripción desde el frontend.
3. El segundo intento debe devolver `400` con mensaje `Ya estás inscrito a este taller` o `Este correo ya está inscrito a este taller`.

## 6. Próximos pasos recomendados

- Implementar validación con `express-validator` en `POST /api/workshops/enroll` (Fase 1.1 del plan general).
- Considerar reducir el tiempo de expiración del JWT de 30 días y/o añadir refresh tokens.
- Adoptar `sequelize-cli` o `umzug` para migraciones versionadas y evitar ALTER TABLE manuales.
