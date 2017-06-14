export function encode(unencoded: string) {
  return new Buffer(unencoded || '')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decode(encoded: string) {
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4) {
    encoded += '=';
  }
  return new Buffer(encoded || '', 'base64').toString('utf8');
}
