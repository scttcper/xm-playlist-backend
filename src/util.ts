import * as _ from 'lodash';

export function encode(unencoded: string) {
  return Buffer.from(unencoded || '')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]+$/, '');
}

export function decode(encoded: string) {
  let enc = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4) {
    enc += '=';
  }

  return Buffer.from(enc || '', 'base64').toString('utf8');
}

// Remove ft feat
export function cleanFt(str: string) {
  return str
    .replace('f.', '')
    .replace(/(f|w)((eat.|t|eat)|(\.|\/))\b/i, ' ')
    .replace(' ft ', ' ');
}

// Remove clean
export function cleanClean(str: string) {
  return str.replace(/(\(|\[)clean(\)|\])/i, '');
}

// Remove OFFICAL MUSIC VIDEO Lyrics
export function cleanMusicVideo(str: string) {
  return str
    .replace(/(\(|\[)Official(\)|\])/i, '')
    .replace(/lyrics/i, '')
    .replace(/(official|music).+(video)/i, '');
}

export function cleanSpaces(str: string) {
  // tslint:disable-next-line:no-regex-spaces
  return _.trim(str.replace(/  +/g, ' '));
}

export function cleanRemix(str: string) {
  return str.replace(/(remix|mix|edit)\b/i, '');
}

export function cleanYear(str: string) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/\((\'?)[0-9]+\)/, '');
}

export function cleanCutoff(str: string) {
  if (str.length === 35) {
    return str.replace(/\s(\w+)$/, '');
  }

  return str;
}

export function noKarayoke(str: string) {
  return str.replace(/\([0-9]+\)/, '');
}

export function cleanupExtra(str: string) {
  const cleanStr = str
    .replace('-', ' ')
    .replace('.', '')
    .replace(',', '')
    .replace('&', ' ')
    .replace('(', ' ')
    .replace(')', ' ')
    .replace('!', ' ');
  const words = cleanStr.split(' ').filter(n => n.length > 1);
  return words.join(' ');
}
