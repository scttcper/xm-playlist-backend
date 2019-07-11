import * as inquirer from 'inquirer';

import config from '../config';
import { updatePlaylists } from '../src/spotify';

async function main() {
  const path = `https://accounts.spotify.com/authorize?client_id=${
    config.spotifyClientId
  }&response_type=code&redirect_uri=https://example.com/&scope=playlist-modify-public&state=xmplaylist`;
  console.log(path);
  // let browser: puppeteer.Browser;
  // try {
  //   browser = await puppeteer.launch({
  //     headless: false,
  //     appMode: true,
  //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(path, { waitUntil: 'networkidle2' });
  //   await page.click('.btn-green');
  //   await page.type('input#login-username', config.spotifyUsername);
  //   await page.type('input#login-password', config.spotifyPassword);
  //   await delay(2000);
  //   await page.click('#login-button');
  //   console.log('Waiting for navigation');
  //   await delay(2000);
  //   const res = await page.waitForNavigation({ timeout: 0 });
  //   console.log('NOT CAUGHT BY RECAPTCHA');
  //   const codeUrl = await page.url();
  //   const qs: any = querystring.parse(url.parse(codeUrl).query);
  //   code = qs.code;
  // } catch (err) {
  //   console.error(err);
  //   sentry.captureException(err);
  //   throw err;
  // } finally {
  //   if (browser) {
  //     browser.close();
  //   }
  // }
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
