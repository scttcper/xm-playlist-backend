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
    <div className="p-2 rounded-lg bg-cool-gray-600 hover:bg-cool-gray-900 shadow-lg sm:p-3 transition ease-in-out duration-500">
      <a
        href={`https://open.spotify.com/user/xmplaylist/playlist/${props.channel.playlist}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackPlaylistClick('spotify', props.channel.id)}
      >
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex-1 flex items-center">
            <span className="flex p-2 rounded-lg text-white bg-cool-gray-800">
              <FontAwesomeIcon icon={['fab', 'spotify']} size="lg" />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="sm:hidden">Spotify Playlist</span>
              <span className="hidden sm:inline">{props.channel.name} playlist on Spotify</span>
            </p>
          </div>
          <div className="w-auto">
            <div className="rounded-md shadow-sm">
              <div className="flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-cool-gray-600 bg-white hover:text-cool-gray-900 focus:outline-none focus:shadow-outline transition ease-in-out duration-150">
                <FontAwesomeIcon className="mr-2" size="sm" icon="external-link-alt" /> Open
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
