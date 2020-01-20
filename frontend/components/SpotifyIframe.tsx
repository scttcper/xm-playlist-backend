import React from 'react';

import { TrackResponse } from '../responses';

export const SpotifyIframe: React.FC<{ track: TrackResponse }> = (props): JSX.Element => {
  const src = `https://open.spotify.com/embed/track/${props.track.spotify.spotify_id}`;

  return (
    <iframe
      src={src}
      width="100%"
      height={75}
      frameBorder={0}
      allow="encrypted-media"
    />
  );
};
