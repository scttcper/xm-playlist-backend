import * as _ from 'lodash';
import * as request from 'request-promise-native';

import config from '../config';

const uri = 'https://www.googleapis.com/youtube/v3/search';

export async function search(query: string): Promise<string | false> {
  const options: request.Options = {
    uri,
    qs: {
      key: config.googleCredentials,
      maxResults: 1,
      part: 'snippet',
      safeSearch: 'none',
      fields: 'items',
      q: _.trim(query),
    },
    json: true,
    gzip: true,
  };
  const res = await request.get(options);
  const list = _.first<any>(res.items);
  if (list) {
    return list.snippet.title;
  }

  return false;
}
