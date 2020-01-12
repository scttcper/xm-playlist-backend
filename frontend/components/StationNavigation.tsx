import React from 'react';
import Link from 'next/link';
import { Channel } from '../channels';

export const StationNavigation: React.FC<{
  channelId: Channel['id'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <div className="text-nowrap" style={{ overflowX: 'auto' }}>
      <div className="d-inline-block mr-3">
        <Link href="/station/[id]" as={`/station/${props.channelId.toLowerCase()}`}>
          <a className={'h3 ' + (props.currentPage === 'recent' ? 'text-dark' : 'text-secondary')}>
            Recently Played
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3">
        <Link href="/station/[id]/newest" as={`/station/${props.channelId.toLowerCase()}/newest`}>
          <a className={'h3 ' + (props.currentPage === 'newest' ? 'text-dark' : 'text-secondary')}>
            New Songs
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3 text-secondary">
        <Link href="/station/[id]/most-heard" as={`/station/${props.channelId.toLowerCase()}/most-heard`}>
          <a className={'h3 ' + (props.currentPage === 'most-heard' ? 'text-dark' : 'text-secondary')}>
            Most Heard
          </a>
        </Link>
      </div>
    </div>
  );
};
