const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT ?? '5000';

export const url = (!dev && process.browser) ? 'https://xmplaylist.com' : `http://localhost:${port}`;
// assuming port 80 for testing email login/signup
export const emailRedirectUrl = dev ? 'http://dev.com' : 'https://xmplaylist.com';
