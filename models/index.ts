/* eslint-disable lines-between-class-members */
/* eslint-disable new-cap */
// tslint:disable:variable-name

import * as Sequelize from 'sequelize';

import config from '../config';

export const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  config.db,
);

export class Track extends Sequelize.Model {
  id!: number;
  songId!: string;
  name!: string;
  plays!: number;
  artists!: Artist[];
  createdAt!: Date;
  updatedAt!: Date;
  spotify!: Spotify;
}

Track.init(
  {
    songId: { type: Sequelize.STRING(15), unique: true },
    name: { type: Sequelize.STRING(200) },
    plays: { type: Sequelize.INTEGER, defaultValue: 1 },
  },
  {
    modelName: 'tracks',
    sequelize,
    indexes: [{ fields: ['createdAt'] }],
  },
);

export class Artist extends Sequelize.Model {
  id!: number;
  name!: string;
  artist_track!: ArtistTrack;
}
Artist.init(
  {
    name: { type: Sequelize.STRING(120), unique: true },
  },
  {
    modelName: 'artists',
    sequelize,
    timestamps: false,
  },
);

export class ArtistTrack extends Sequelize.Model {}
ArtistTrack.init(
  {},
  {
    modelName: 'artist_tracks',
    sequelize,
    timestamps: false,
  },
);

export class Play extends Sequelize.Model {
  trackId!: number | string;
  startTime!: Date;
  channel!: number;
  track!: Track;
}
Play.init(
  {
    channel: { type: Sequelize.INTEGER },
    startTime: { type: Sequelize.DATE },
  },
  {
    modelName: 'plays',
    sequelize,
    timestamps: false,
    indexes: [{ fields: ['startTime'] }],
  },
);

export class Spotify extends Sequelize.Model {
  id!: number;
  trackId!: number;
  cover!: string;
  url!: string;
  spotifyId!: string;
  spotifyName!: string;
  durationMs!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

Spotify.init(
  {
    spotifyId: { type: Sequelize.STRING(50) },
    spotifyName: { type: Sequelize.STRING(200) },
    cover: { type: Sequelize.STRING(200) },
    url: { type: Sequelize.STRING(200) },
    durationMs: { type: Sequelize.INTEGER },
  },
  {
    modelName: 'spotifies',
    sequelize,
    indexes: [{ fields: ['trackId'], unique: true }],
  },
);

Track.belongsToMany(Artist, { through: ArtistTrack });
Play.belongsTo(Track);
Spotify.belongsTo(Track);
Track.hasOne(Spotify);
