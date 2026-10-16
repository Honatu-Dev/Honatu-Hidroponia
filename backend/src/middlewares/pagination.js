// Helper de paginación: solo pagina si el cliente envía ?page o ?limit.
// Sin parámetros devuelve null para mantener compatibilidad con respuestas
// que devuelven el arreglo completo.
export const getPagination = (req, defaultLimit = 20, maxLimit = 100) => {
  const { page, limit } = req.query;
  if (page === undefined && limit === undefined) return null;

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || defaultLimit, 1), maxLimit);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

  return {
    limit: parsedLimit,
    offset: (parsedPage - 1) * parsedLimit,
    page: parsedPage
  };
};

export const pagedResponse = (result, { page, limit }) => ({
  items: result.rows,
  total: result.count,
  page,
  pages: Math.ceil(result.count / limit)
});
