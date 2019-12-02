import next from 'next';

export const nextHandlerWrapper = (app: ReturnType<typeof next>) => {
  const handler = app.getRequestHandler();
  return async ({ raw, url }, h) => {
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

export const defaultHandlerWrapper = (app: ReturnType<typeof next>) => async (
  { raw: { req, res }, url },
  h,
) => {
  const { pathname, query } = url;
  const html = await app.renderToHTML(req, res, pathname, query);
  return h.response(html).code(res.statusCode);
};

export const pathWrapper = (app: ReturnType<typeof next>, pathName, opts?) => async (
  { raw, query, params },
  h,
) => {
  const html = await app.renderToHTML(raw.req, raw.res, pathName, { ...query, ...params }, opts);
  return h.response(html).code(raw.res.statusCode);
};
