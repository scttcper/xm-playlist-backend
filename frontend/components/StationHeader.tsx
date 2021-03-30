import React from 'react';
import Link from 'next/link';

import { Channel } from '../channels';
import { StationNavigation } from './StationNavigation';
import { StationSpotifyPlaylist } from './StationSpotifyPlaylist';
import { Adsense } from './Adsense';

type Props = {
  channel: Channel;
  currentPage: 'recent' | 'newest' | 'most-heard';
};

/** Terrible name, everything including the header, used in station pages */
export const StationHeader = ({ channel, currentPage }: Props) => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-4 md:mb-3 flex">
        <div className="flex-0 mr-2 md:mr-3 flex w-24 md:w-32">
          <div className="bg-gray-900 rounded-lg p-3">
            <img src={`/img/${channel.deeplink}-sm.png`} alt={`${channel.name} Logo`} />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg p-3 sm:p-4 pt-2 flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="flex text-2xl font-bold leading-7 mb-1 text-gray-900 sm:text-3xl sm:leading-7">
              {channel.name}
              <Link prefetch={false} href={`/station?genre=${channel.genre}`}>
                <a className="ml-3 hidden md:inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium leading-5 bg-gray-100 text-gray-800 capitalize">
                  {channel.genre}
                </a>
              </Link>
            </h2>
            <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
              <div className="md:mt-2 flex items-center text-sm leading-5 text-gray-500 mb-2 sm:mr-6">
                <p>{channel.desc}</p>
              </div>
            </div>
          </div>

          {channel.playlist && (
            <div>
              <StationSpotifyPlaylist channel={channel} />
            </div>
          )}
        </div>
      </div>
      {/* old */}

      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 text-center my-2">
        <Adsense />
      </div>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8">
        <div className="flex-1 bg-white rounded-lg p-3">
          <StationNavigation channelDeeplink={channel.deeplink} currentPage={currentPage} />
        </div>
      </div>
    </>
  );
};
