import { Channel } from './channels';

export interface TrackModel {
  id: string;
  name: string;
  artists: string;
}

export interface ScrobbleModel {
  trackId: string;
  channel: Channel['deeplink'];
  startTime: Date;
}

export interface Spotify {
  trackId: number;
  cover: string;
  url: string;
  spotifyId: string;
  spotifyName: string;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
}
