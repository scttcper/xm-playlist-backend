const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || '3000';

export const url = dev ? `http://localhost:${port}` : 'https://xmplaylist.com';
