import Server from 'next/dist/next-server/server/next-server';

export const nextHandlerWrapper = (app: Server) => {
  const handler = app.getRequestHandler();
  return async ({ raw, url }, h) => {
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

export const defaultHandlerWrapper = (app: Server) => async (
  { raw: { req, res }, url },
  h,
) => {
  const { pathname, query } = url;
  const html = await app.renderToHTML(req, res, pathname, query);
  return h.response(html).code(res.statusCode);
};

export const pathWrapper = (app: Server, pathName: string) => async (
  { raw, query, params },
  h,
) => {
  const html = await app.renderToHTML(raw.req, raw.res, pathName, { ...query, ...params });
  return h.response(html).code(raw.res.statusCode);
};
