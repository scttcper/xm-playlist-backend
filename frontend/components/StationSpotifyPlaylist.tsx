import React from 'react';
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
    <span className="inline-flex rounded-md shadow-sm">
      <a
        href={`https://open.spotify.com/user/xmplaylist/playlist/${props.channel.playlist}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 border border-gray-300 text-xs md:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
        onClick={() => trackPlaylistClick('spotify', props.channel.id)}
      >
        <FontAwesomeIcon icon={['fab', 'spotify']} className="mr-1" />
        View on Spotify <FontAwesomeIcon className="ml-2" size="sm" icon="external-link-alt" />
      </a>
    </span>
  );
};
