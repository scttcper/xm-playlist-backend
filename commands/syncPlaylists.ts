import * as inquirer from 'inquirer';

import config from '../config';
import { updatePlaylists } from '../src/spotify';

async function main() {
  const path = `https://accounts.spotify.com/authorize?client_id=${
    config.spotifyClientId
  }&response_type=code&redirect_uri=https://example.com/&scope=playlist-modify-public&state=xmplaylist`;
  console.log(path);

  const answers = await inquirer.prompt<any>([
    { name: 'code', type: 'input', message: 'Gib code' },
  ]);
  const { code } = answers;
  if (!code) {
    throw new Error('No update code');
  }

  try {
    await updatePlaylists(code);
  } catch (err) {
    console.error(err);
    throw err;
  }

  console.log('success');
}

main()
  .then(() => process.exit())
  .catch(e => console.error(e));
