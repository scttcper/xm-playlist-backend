import * as Sequelize from 'sequelize';

import config from '../config';

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.db,
);

export interface TrackAttributes {
  id: number;
  songId: string;
  name: string;
  plays?: number;
  artists?: ArtistAttributes[];
  createdAt?: Date;
  updatedAt?: Date;
}
export type TrackInstance = Sequelize.Instance<TrackAttributes>;
export const Track = sequelize.define<TrackInstance, TrackAttributes>('track', {
  songId: { type: Sequelize.STRING(15), unique: true },
  name: { type: Sequelize.STRING(200) },
  plays: { type: Sequelize.INTEGER, defaultValue: 1 },
});

export interface ArtistAttributes {
  id?: number;
  name?: string;
  artist_track: ArtistTrackAttributes;
}
export type ArtistInstance = Sequelize.Instance<ArtistAttributes>;
export const Artist = sequelize.define<ArtistInstance, ArtistAttributes>('artist', {
  name: { type: Sequelize.STRING(120), unique: true },
}, {
  timestamps: false,
});

export interface ArtistTrackAttributes {
  trackId: string;
  artistId: number;
}
export type ArtistTrackInstance = Sequelize.Instance<ArtistTrackAttributes>;
export const ArtistTrack = sequelize.define<ArtistTrackInstance, ArtistTrackAttributes>('artist_track', {
}, {
  timestamps: false,
});

export interface PlayAttributes {
  trackId: string;
  startTime?: Date;
  channel?: number;
}
export type PlayInstance = Sequelize.Instance<PlayAttributes>;
export const Play = sequelize.define<PlayInstance, PlayAttributes>('play', {
  channel: { type: Sequelize.INTEGER },
  startTime: { type: Sequelize.DATE },
}, {
  timestamps: false,
  indexes: [
    { fields: ['startTime'] },
  ],
});

export interface SpotifyAttributes {
  trackId: string;
  cover: string;
  url: string;
  spotifyId: string;
  spotifyName: string;
  durationMs: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export type SpotifyInstance = Sequelize.Instance<SpotifyAttributes>;
export const Spotify = sequelize.define<SpotifyInstance, SpotifyAttributes>('spotify', {
  spotifyName: { type: Sequelize.STRING(200) },
  cover: { type: Sequelize.STRING(200) },
  url: { type: Sequelize.STRING(200) },
  durationMs: { type: Sequelize.INTEGER },
});

Track.belongsToMany(Artist, { through: ArtistTrack });
Play.belongsTo(Track);
Spotify.belongsTo(Track);
