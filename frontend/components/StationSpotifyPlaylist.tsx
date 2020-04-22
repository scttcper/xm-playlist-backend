import React from 'react';
import LazyLoad from 'react-lazyload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';

import { Channel } from '../channels';

function trackPlaylistClick(type: string, channelId: string): void {
  ReactGA.event({
    category: 'Playlist',
    action: type,
    label: channelId,
  });
}

export const StationSpotifyPlaylist: React.FC<{ channel: Channel }> = props => {
  return (
    <a
      href={`https://open.spotify.com/user/xmplaylist/playlist/${props.channel.playlist}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPlaylistClick('spotify', props.channel.id)}
    >
      <div className="bg-white text-dark shadow rounded p-3 d-flex justify-content-start">
        <div className="">
          <LazyLoad>
            <FontAwesomeIcon
              className="mr-2"
              style={{ color: '#000' }}
              icon={['fab', 'spotify']}
              size="lg"
            />
          </LazyLoad>
        </div>
        <div className="mr-auto">{props.channel.name} playlist on Spotify</div>
        <div>
          <LazyLoad>
            <FontAwesomeIcon size="sm" icon="external-link-alt" />
          </LazyLoad>
        </div>
      </div>
    </a>
  );
};
