# Despliegue en Ubuntu/Debian con Nginx y PM2

Esta aplicación usa Vite para generar un frontend estático, Express para la API y PostgreSQL. Nginx sirve `frontend/dist` y envía `/api/*` al backend en `127.0.0.1:5000`.

## 1. DNS y servidor

Antes de solicitar HTTPS, crea registros DNS `A` para el dominio y `www` apuntando a la IP pública del servidor.

```bash
ssh usuario@IP_DEL_SERVIDOR
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx postgresql postgresql-contrib git curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
node --version
npm --version
```

## 2. Usuario y base de datos

Genera una contraseña fuerte y sustituye los valores de ejemplo:

```bash
sudo -u postgres psql
```

```sql
CREATE USER honatu WITH PASSWORD 'CONTRASENA_SEGURA';
CREATE DATABASE honatu OWNER honatu;
\q
```

PostgreSQL queda accesible solamente de forma local con la configuración predeterminada.

## 3. Instalar la aplicación

```bash
sudo mkdir -p /var/www/Honatu-Hidroponia
sudo chown -R "$USER":"$USER" /var/www/Honatu-Hidroponia
git clone URL_DEL_REPOSITORIO /var/www/Honatu-Hidroponia
cd /var/www/Honatu-Hidroponia
npm ci
```

## 4. Variables de producción

```bash
cp deploy/backend.env.example backend/.env
cp deploy/frontend.env.example frontend/.env.production
nano backend/.env
nano frontend/.env.production
```

En `backend/.env`:

- Cambia `JWT_SECRET` por el resultado de `openssl rand -hex 64`.
- Cambia `DB_PASS` por la contraseña de PostgreSQL.
- Sustituye `example.com` en `CORS_ORIGIN` por el dominio real.
- Mantén `HOST=127.0.0.1`; la API no debe exponerse directamente a Internet.

`VITE_API_URL` puede quedar vacío: el frontend utilizará el mismo dominio y Nginx enviará `/api` al backend. Define el Cloud Name real si no es `usn9paiw`.

Para crear las tablas en una base de datos nueva, cambia temporalmente `DB_SYNC=true`, inicia la API una vez y, después de comprobar que arrancó, vuelve a establecer `DB_SYNC=false`. En actualizaciones futuras deben utilizarse migraciones o un respaldo de la base de datos; no uses sincronización destructiva.

## 5. Construir el frontend y arrancar la API

```bash
cd /var/www/Honatu-Hidroponia
npm run build:frontend
pm2 start ecosystem.config.cjs
pm2 logs honatu-api --lines 50
curl http://127.0.0.1:5000/api/health
```

Cuando la base de datos inicial ya esté creada:

```bash
nano backend/.env
pm2 restart honatu-api --update-env
pm2 save
pm2 startup
```

Ejecuta el comando con `sudo` que imprima `pm2 startup` y vuelve a ejecutar `pm2 save`.

## 6. Nginx

Edita el dominio del archivo antes de instalarlo:

```bash
cd /var/www/Honatu-Hidroponia
sed 's/example.com/TU_DOMINIO/g' deploy/nginx.conf | sudo tee /etc/nginx/sites-available/honatu >/dev/null
sudo ln -s /etc/nginx/sites-available/honatu /etc/nginx/sites-enabled/honatu
sudo nginx -t
sudo systemctl reload nginx
```

Si el enlace ya existe, no vuelvas a crearlo. La raíz configurada es `/var/www/Honatu-Hidroponia/frontend/dist`; cambia el archivo si clonaste el repositorio en otra ruta.

Prueba por HTTP:

```bash
curl http://TU_DOMINIO/api/health
```

## 7. Firewall y HTTPS

Autoriza SSH antes de habilitar UFW para no perder acceso al servidor:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d TU_DOMINIO -d www.TU_DOMINIO
sudo certbot renew --dry-run
```

Comprueba `https://TU_DOMINIO`, `https://TU_DOMINIO/api/health` y `https://TU_DOMINIO/api/docs`.

## Actualizaciones

Haz un respaldo de PostgreSQL antes de desplegar cambios de modelos:

```bash
pg_dump -h 127.0.0.1 -U honatu -Fc honatu > honatu-$(date +%F).dump
cd /var/www/Honatu-Hidroponia
git pull --ff-only
npm ci
npm run build:frontend
pm2 restart honatu-api --update-env
curl http://127.0.0.1:5000/api/health
sudo nginx -t
```

No es necesario reiniciar Nginx cuando solo cambian el frontend o el backend.

## Diagnóstico

```bash
pm2 status
pm2 logs honatu-api
sudo journalctl -u nginx -n 100 --no-pager
sudo nginx -t
sudo systemctl status postgresql nginx
```
