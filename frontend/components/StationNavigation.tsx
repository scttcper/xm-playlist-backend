import Link from 'next/link';
import React from 'react';

import { Channel } from '../channels';

export const StationNavigation: React.FC<{
  channelDeeplink: Channel['deeplink'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <nav className="grid gap-2 md:gap-3 grid-cols-3 text-center">
      <Link href="/station/[id]" as={`/station/${props.channelDeeplink.toLowerCase()}`}>
        <a
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md focus:outline-none ${
            props.currentPage === 'recent'
              ? 'text-blue-700 bg-blue-100 focus:text-blue-800 focus:bg-blue-200'
              : 'text-gray-500 hover:text-gray-800 focus:text-blue-600 focus:bg-blue-50 border border-gray-300 hover:border-gray-400 border-solid'
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
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600 focus:bg-blue-50 ${
            props.currentPage === 'newest'
              ? 'text-blue-700 bg-blue-100 focus:text-blue-800 focus:bg-blue-200'
              : 'text-gray-500 hover:text-gray-800 focus:text-blue-600 focus:bg-blue-50 border border-gray-300 hover:border-gray-400 border-solid'
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
          className={`px-3 py-2 font-medium text-sm leading-5 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600 focus:bg-blue-50 ${
            props.currentPage === 'most-heard'
              ? 'text-blue-700 bg-blue-100 focus:text-blue-800 focus:bg-blue-200'
              : 'text-gray-500 hover:text-gray-800 focus:text-blue-600 focus:bg-blue-50 border border-gray-300 hover:border-gray-400 border-solid'
          }`}
        >
          Most Heard
        </a>
      </Link>
    </nav>
  );
};
