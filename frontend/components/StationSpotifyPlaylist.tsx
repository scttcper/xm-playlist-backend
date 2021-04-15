import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';

import { Channel } from '../channels';
import { Spotify } from './icons/Spotify';

function trackPlaylistClick(type: string, channelId: string): void {
  gtag('event', 'playlist_click', {
    category: 'engagement',
    action: type,
    label: channelId,
  });
}

type Props = {
  channel: Channel;
};

export const StationSpotifyPlaylist = ({ channel }: Props) => {
  return (
    <span className="inline-flex rounded-md shadow-sm">
      <a
        href={`https://open.spotify.com/user/xmplaylist/playlist/${channel.playlist}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 border border-gray-300 text-xs md:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
        onClick={() => trackPlaylistClick('spotify', channel.id)}
      >
        <Spotify className="mr-1 h-3.5 w-3.5" />
        View on Spotify <ExternalLinkIcon className="ml-1 h-4 w-4" aria-hidden="true" />
      </a>
    </span>
  );
};
