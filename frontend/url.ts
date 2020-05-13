const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || '5000';

export const url = dev ? `http://localhost:${port}` : 'https://xmplaylist.com';
