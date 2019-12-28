import React from 'react';
import Link from 'next/link';
import { Channel } from '../src/channels';

export const StationNavigation: React.FC<{
  channelId: Channel['id'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <div className="text-nowrap overflow-auto">
      <div className="d-inline-block mr-3">
        <Link href={`/station/${props.channelId.toLowerCase()}`}>
          <a className={'h2 ' + (props.currentPage === 'recent' ? 'text-dark font-weight-bolder' : 'text-secondary')}>
            Recently Played
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3">
        <Link href={`/station/${props.channelId.toLowerCase()}/newest`}>
          <a className={'h2 ' + (props.currentPage === 'newest' ? 'text-dark font-weight-bolder' : 'text-secondary')}>
            New Songs
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3 text-secondary">
        <Link href={`/station/${props.channelId.toLowerCase()}/newest`}>
          <a className={'h2 ' + (props.currentPage === 'most-heard' ? 'text-dark font-weight-bolder' : 'text-secondary')}>
            Most Heard
          </a>
        </Link>
      </div>
    </div>
  );
};
