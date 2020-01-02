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
  links: Array<{ site: string; url: string }>;
  start_time: string;
}

export interface StationNewest extends StationRecent {
  plays: number;
}
