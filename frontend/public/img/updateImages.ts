/* eslint-disable @typescript-eslint/restrict-template-expressions */
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import got from 'got';

import { channels } from 'frontend/channels';

async function execShellCommand(cmd: string) {
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }

      resolve(stdout ? stdout : stderr);
    });
  });
}

async function updateImages() {
  for (const channel of channels) {
    const url = `http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink?deepLinkId=${channel.deeplink}&deepLink-type=live`;
    console.log(channel.deeplink);
    const response = await got.get(url).json<any>();
    // eslint-disable-next-line prefer-destructuring
    const images =
      response.ModuleListResponse.moduleList.modules[0].moduleResponse.moduleDetails
        .liveChannelResponse.liveChannelResponses[0].channel.images.images;
    const sqImage = images.find(x => x.name === 'color channel logo (on dark) ~ square');
    if (sqImage.height !== sqImage.width) {
      console.log(`SIZE SKIPPING ${channel.deeplink}`);
    }

    const channelInfo =
      response.ModuleListResponse.moduleList.modules[0].moduleResponse.moduleDetails
        .liveChannelResponse.liveChannelResponses[0];
    if (channel.id !== channelInfo.channelId) {
      throw new Error(`${channel.id} !== ${channelInfo.channelId}`);
    }

    if (channel.name !== channelInfo.channel.name) {
      console.error(channelInfo.channel.name);
      throw new Error(`name`);
    }

    if (channel.number !== Number(channelInfo.channel.xmChannelNumber)) {
      console.error(channelInfo.channel.xmChannelNumber);
      throw new Error(`xmChannelNumber`);
    }

    if (channel.desc.trim() !== channelInfo.channel.mediumDescription.trim()) {
      console.error(channelInfo.channel.mediumDescription);
    }

    const filepath = path.join(__dirname, `${channel.deeplink}-lg.png`);
    const filepathSm = path.join(__dirname, `${channel.deeplink}-sm.png`);
    const res = await got.get(sqImage.url, { responseType: 'buffer' }).buffer();
    fs.writeFileSync(filepath, res);
    fs.writeFileSync(filepathSm, res);
    await execShellCommand(`sips -Z 320 ${filepathSm}`);
    await execShellCommand(`open -a Optimage "${filepath}"`);
    await execShellCommand(`open -a Optimage "${filepathSm}"`);
  }
}

updateImages()
  .then(() => console.log('success'))
  .catch(console.error);
