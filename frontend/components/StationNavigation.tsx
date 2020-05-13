import Link from 'next/link';
import React from 'react';

import { Channel } from 'frontend/channels';

export const StationNavigation: React.FC<{
  channelDeeplink: Channel['deeplink'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <div className="text-nowrap" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div className="d-inline-block mr-3">
        <Link href="/station/[id]" as={`/station/${props.channelDeeplink.toLowerCase()}`}>
          <a className={'h3 ' + (props.currentPage === 'recent' ? 'text-dark' : 'text-secondary')}>
            Recently Played
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3">
        <Link href="/station/[id]/newest" as={`/station/${props.channelDeeplink.toLowerCase()}/newest`}>
          <a className={'h3 ' + (props.currentPage === 'newest' ? 'text-dark' : 'text-secondary')}>
            New Songs
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3 text-secondary">
        <Link
          href="/station/[id]/most-heard"
          as={`/station/${props.channelDeeplink.toLowerCase()}/most-heard`}
        >
          <a
            className={`h3  ${props.currentPage === 'most-heard' ? 'text-dark' : 'text-secondary'}`}
          >
            Most Heard
          </a>
        </Link>
      </div>
    </div>
  );
};
