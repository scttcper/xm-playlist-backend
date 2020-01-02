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
  trackId: string;
  spotifyId: string;
  name: string;
  cover: string | null;
  previewUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
