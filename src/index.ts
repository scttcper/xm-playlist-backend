import * as debug from 'debug';
import * as Koa from 'koa';
import * as kcors from 'kcors';
import * as logger from 'koa-logger';
import * as koaRaven from 'koa2-raven';
import * as Raven from 'raven';
import * as Router from 'koa-router';
import * as _ from 'lodash';

import config from '../config';
import { channels } from './channels';
const stream = require('./stream');
const tracks = require('./tracks');
const spotify = require('./spotify');

const log = debug('xmplaylist');
const app = new Koa();
export default app;
app.proxy = true;
const router = new Router();

app.use(kcors());
if (process.env.NODE_ENV === 'dev') {
  app.use(logger());
}
app.use((ctx, next) => {
  ctx.type = 'json';
  return next();
});

// routes
router.get('/recent/:channelName', async (ctx, next) => {
  const channel = _.find(channels, { name: ctx.params.channelName });
  ctx.assert(channel, 400, 'Channel does not exist');
  let last = new Date();
  if (ctx.query.last) {
    last = new Date(parseInt(ctx.query.last || 0, 10));
  }
  ctx.body = await stream.getRecent(channel, last);
  return next();
});
router.get('/mostHeard/:channelName', async (ctx, next) => {
  const channel = _.find(channels, { name: ctx.params.channelName });
  ctx.assert(channel, 400, 'Channel does not exist');
  ctx.body = await stream.mostHeard(channel);
  return next();
});
router.get('/track/:songId', async (ctx, next) => {
  ctx.assert(ctx.params.songId, 400, 'Song Id required');
  ctx.body = await tracks.getTrack(ctx.params.songId);
  return next();
});

router.get('/artists', async (ctx, next) => {
  ctx.body = await tracks.artists();
  return next();
});

router.get('/channels', (ctx, next) => {
  ctx.body = channels.map((n) => {
    n.img = `https://www.siriusxm.com/albumart/Live/Default/DefaultMDS_m_${n.number}.jpg`;
    return n;
  });
  return next();
});

router.get('/spotify/:songId', async (ctx, next) => {
  const songId = ctx.params.songId;
  let doc;
  try {
    doc = await spotify.get(songId);
  } catch (e) {
    ctx.throw(404, 'Not Found');
  }
  ctx.assert(doc, 404, 'Not Found');
  ctx.body = doc;
  return next();
});
// app.use(route.get('/new', ep.newsongs));
// app.use(route.get('/artists', ep.allArtists));
// app.use(route.get('/artist/:artist', ep.artists));
// app.use(route.get('/song/:song', ep.songFromID));
// app.use(route.get('/songstream/:song', ep.songstream));

app
  .use(router.routes())
  .use(router.allowedMethods());

if (!module.parent) {
  app.listen(config.port);
  log('listening on port:', config.port);
}
