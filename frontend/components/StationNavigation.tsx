/* eslint-disable operator-linebreak */
import Link from 'next/link';
import React from 'react';

import { Channel } from '../channels';

export const StationNavigation: React.FC<{
  channelDeeplink: Channel['deeplink'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <nav className="grid gap-2 grid-cols-3 text-center">
      <Link href="/station/[id]" as={`/station/${props.channelDeeplink.toLowerCase()}`}>
        <a
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md focus:outline-none ${
            props.currentPage === 'recent'
              ? 'text-indigo-700 bg-indigo-100 focus:text-indigo-800 focus:bg-indigo-200'
              : 'text-gray-500 hover:text-gray-700 focus:text-indigo-600 focus:bg-indigo-50'
          }`}
        >
          On Now
        </a>
      </Link>
      <Link
        href="/station/[id]/newest"
        as={`/station/${props.channelDeeplink.toLowerCase()}/newest`}
      >
        <a
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:text-indigo-600 focus:bg-indigo-50 border border-gray-300 ${
            props.currentPage === 'newest'
              ? 'text-indigo-700 bg-indigo-100 focus:text-indigo-800 focus:bg-indigo-200 border-solid'
              : 'text-gray-500 hover:text-gray-700 focus:text-indigo-600 focus:bg-indigo-50'
          }`}
        >
          Newest
        </a>
      </Link>
      <Link
        href="/station/[id]/most-heard"
        as={`/station/${props.channelDeeplink.toLowerCase()}/most-heard`}
      >
        <a
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:text-indigo-600 focus:bg-indigo-50 border border-gray-300 ${
            props.currentPage === 'most-heard'
              ? 'text-indigo-700 bg-indigo-100 focus:text-indigo-800 focus:bg-indigo-200'
              : 'text-gray-500 hover:text-gray-700 focus:text-indigo-600 focus:bg-indigo-50'
          }`}
        >
          Most Heard
        </a>
      </Link>
    </nav>
  );
};
