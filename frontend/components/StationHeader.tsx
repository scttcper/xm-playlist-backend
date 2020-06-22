import React from 'react';
import { Adsense } from '@ctrl/react-adsense';

import { StationNavigation } from './StationNavigation';
import { StationSpotifyPlaylist } from './StationSpotifyPlaylist';
import { Channel } from '../channels';

type Props = {
  channel: Channel;
  currentPage: 'recent' | 'newest' | 'most-heard';
};

/** Terrible name, everything including the header, used in station pages */
export const StationHeader = (props: Props) => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-4 md:mb-3 flex">
        <div className="flex-0 bg-cool-gray-900 rounded-lg p-3 mr-2 md:mr-3 flex">
          <img
            src={`/static/img/${props.channel.deeplink}-lg.png`}
            className="w-24 h-24 md:h-32 md:w-32"
            alt="..."
          />
        </div>
        <div className="flex-1 bg-white rounded-lg p-3 sm:p-4 pt-2 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="flex text-2xl font-bold leading-7 mb-1 text-gray-900 sm:text-3xl sm:leading-7 sm:truncate">
              {props.channel.name}
              <span className="ml-3 hidden md:inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium leading-5 bg-gray-100 text-gray-800 capitalize">
                {props.channel.genre}
              </span>
            </h2>
            <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
              <div className="md:mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6">
                {props.channel.desc}
              </div>
            </div>
          </div>

          <div className="">
            <StationSpotifyPlaylist channel={props.channel} />
          </div>
        </div>
      </div>
      {/* old */}

      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 text-center adsbygoogle my-2">
        <Adsense client="ca-pub-7640562161899788" slot="5645069928" style={{display: 'block'}} />
      </div>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8">
        <div className="flex-1 bg-white rounded-lg p-3">
          <StationNavigation
            channelDeeplink={props.channel.deeplink}
            currentPage={props.currentPage}
          />
        </div>
      </div>
    </>
  );
};
