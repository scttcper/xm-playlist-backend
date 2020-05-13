import React from 'react';
import AdSense from 'react-adsense';

import { StationHeader } from './StationHeader';
import { StationNavigation } from './StationNavigation';
import { StationSpotifyPlaylist } from './StationSpotifyPlaylist';
import { Channel } from 'frontend/channels';

// Terrible name, everything including the header, used in station pages
export const StationTop: React.FC<{
  channel: Channel;
  currentPage: 'recent' | 'newest' | 'most-heard';
}> = props => {
  return (
    <>
      <div className="bg-light">
        <div className="container pt-2" style={{ paddingBottom: '2.5rem' }}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <StationHeader channel={props.channel} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-1" style={{ marginTop: '-1.8rem' }}>
        <div className="row">
          <div className="col-12 mb-2">
            <StationSpotifyPlaylist channel={props.channel} />
          </div>
        </div>
      </div>
      <div className="container mb-3 adsbygoogle">
        <div className="row">
          <div className="col-12">
            <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
          </div>
        </div>
      </div>
      <div className="container mb-3">
        <div className="row">
          <div className="col-12">
            <StationNavigation
              channelDeeplink={props.channel.deeplink}
              currentPage={props.currentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};
