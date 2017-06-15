import * as moment from 'moment';

import { Play, PlayAttributes, Track } from '../models';
import { Channel } from './channels';

export async function getLast(channel: Channel) {
  return await Play
    .findOne({
      where: { channel: channel.number },
      order: [['id', 'DESC']],
      include: [{ model: Track }],
    });
}

export async function getRecent(channel, last) {
  return await Play.findAll({
    where: { startTime: { $lt: last } },
    order: [['id', 'DESC']],
    limit: 15,
  });
}

export async function mostHeard(channel) {
  // TODO: group
  return await Play.findAll();
  // const db = await mongo;
  // const date = moment().subtract(1, 'days').toDate();
  // return db.collection('stream')
  //   .aggregate([
  //     { $match: {
  //       startTime: { $gte: date },
  //       channelId: channel.id,
  //     } },
  //     { $group: {
  //       _id: '$songId',
  //       count: { $sum: 1 },
  //       songId: { $first: '$songId' },
  //       name: { $first: '$name' },
  //       artistsId: { $first: '$artistsId' },
  //       artists: { $first: '$artists' },
  //     } },
  //     { $sort: { count: -1 } },
  //   ])
  //   .toArray();
}
