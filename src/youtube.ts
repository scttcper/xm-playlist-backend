import got from 'got';
import { URLSearchParams } from 'url';

import config from '../config';

export async function search(query: string): Promise<string | false> {
  const searchParams = new URLSearchParams({
    key: config.googleCredentials,
    maxResults: '1',
    part: 'snippet',
    safeSearch: 'none',
    fields: 'items',
    q: query.trim(),
  });
  const res = await got.get('https://www.googleapis.com/youtube/v3/search', { searchParams }).json<any>();
  const list = res.items[0];
  if (list) {
    return list.snippet.title;
  }

  return false;
}
