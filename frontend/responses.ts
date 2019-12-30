/* eslint-disable @typescript-eslint/camelcase */
export interface StationRecent {
  spotify: {
    spotify_id: string;
    preview_url: string;
    cover: string;
  };
  track: {
    id: string;
    name: string;
    artists: string[];
  };
  start_time: string;
}
