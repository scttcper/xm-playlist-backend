import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Channel } from '../src/channels';

export const StationNavigation: React.FC<{
  channelId: Channel['id'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <div className="col-12 text-nowrap overflow-auto">
      <div className="d-inline-block mr-3">
        <Link href={`/station/${props.channelId}`}>
          <a className={'h3 ' + (props.currentPage === 'recent' ? 'text-dark font-weight-bolder' : 'text-primary')}>
            Recently Played
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3">
        <Link href={`/station/${props.channelId}/newest`}>
          <a className={'h3 ' + (props.currentPage === 'newest' ? 'text-dark font-weight-bolder' : 'text-primary')}>
            Newest
          </a>
        </Link>
      </div>
      <div className="d-inline-block mr-3 text-secondary">
        <Link href={`/station/${props.channelId}/newest`}>
          <a className={'h3 ' + (props.currentPage === 'most-heard' ? 'text-dark font-weight-bolder' : 'text-primary')}>
            Most Heard
          </a>
        </Link>
      </div>
    </div>
  );
};

StationNavigation.propTypes = {
  channelId: PropTypes.string.isRequired,
  currentPage: PropTypes.oneOf(['recent', 'newest', 'most-heard'] as const).isRequired,
};
