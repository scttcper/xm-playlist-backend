import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Channel } from '../src/channels';

export const StationNavigation: React.FC<{
  channelId: Channel['id'];
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <div className="container mb-2">
      <div className="row">
        <div className="col-12 text-nowrap overflow-auto">
          <div className="d-inline-block mr-3">
            <Link href={`/station/${props.channelId}`}>
              <a className={props.currentPage === 'recent' ? 'text-dark' : 'text-secondary'}>
                <h3>Recently Played</h3>
              </a>
            </Link>
          </div>
          <div className="d-inline-block mr-3">
            <Link href={`/station/${props.channelId}/newest`}>
              <a className={props.currentPage === 'newest' ? 'text-dark' : 'text-secondary'}>
                <h3>Newest</h3>
              </a>
            </Link>
          </div>
          <div className="d-inline-block mr-3 text-secondary">
            <Link href={`/station/${props.channelId}/newest`}>
              <a className={props.currentPage === 'most-heard' ? 'text-dark' : 'text-secondary'}>
                <h3>Most Heard</h3>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

StationNavigation.propTypes = {
  channelId: PropTypes.string.isRequired,
  currentPage: PropTypes.oneOf(['recent', 'newest', 'most-heard'] as const).isRequired,
};
