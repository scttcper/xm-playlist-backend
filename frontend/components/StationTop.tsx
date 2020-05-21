import React from 'react';
import AdSense from 'react-adsense';

import { StationNavigation } from './StationNavigation';
import { StationSpotifyPlaylist } from './StationSpotifyPlaylist';
import { Channel } from '../channels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

type Props = {
  channel: Channel;
  currentPage: 'recent' | 'newest' | 'most-heard';
};

/** Terrible name, everything including the header, used in station pages */
export const StationTop: React.FC<Props> = props => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-5 md:mb-3 flex">
        <div className="flex-0 bg-gray-800 rounded-lg p-3 mr-2 flex">
          <img
            src={`/static/img/${props.channel.deeplink}-lg.png`}
            className="w-24 h-24 md:h-32 md:w-32"
            alt="..."
          />
        </div>
        <div className="flex-1 bg-white rounded-lg p-3 sm:p-5">
          <nav className="hidden md:flex items-center text-sm leading-5 font-medium">
            <Link href="/station">
              <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
                Stations
              </a>
            </Link>
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-500">{props.channel.name}</span>
          </nav>

          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 mb-1 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
                {props.channel.name}
              </h2>
              <div className="flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
                <div className="md:mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6">
                  {props.channel.desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* old */}

      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 mb-2">
        <StationSpotifyPlaylist channel={props.channel} />
      </div>
      <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8">
        <div className="flex-1 bg-white rounded-lg p-3 sm:p-5">
          <StationNavigation
            channelDeeplink={props.channel.deeplink}
            currentPage={props.currentPage}
          />
        </div>
      </div>
    </>
  );
};
