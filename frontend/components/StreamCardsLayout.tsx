import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TrackResponse } from '../responses';
import { TrackLinks } from './TrackLinks';
import { Channel } from '../channels';

export const StreamCardsLayout: React.FC<{
  tracks: TrackResponse[][];
  channel: Channel;
  secondaryText?: (track: TrackResponse) => string;
}> = props => {
  return (
    <>
      {props.tracks.map((chunk, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="col-12 adsbygoogle mb-3">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          )}
          {chunk.map(play => {
            const albumCover = play.spotify.cover || '/static/missing.png';
            return (
              <React.Fragment key={play.track.id}>
                <div className="col-4 col-lg-3 d-none d-md-block mb-3">
                  <div className="card h-100 shadow-sm border-0">
                    <img src={albumCover} className="card-img-top" alt="..." />
                    <div className="card-body d-flex align-items-start flex-column">
                      <div className="mb-auto pb-4" style={{ maxWidth: '100%' }}>
                        {props.secondaryText && <small className="text-secondary">{props.secondaryText(play)}</small>}
                        <h5 className="mt-1 mb-0">{play.track.name}</h5>
                        <ul className="list-inline">
                          {play.track.artists.map((artist, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <small key={index} className="mr-2">
                              {artist}
                            </small>
                          ))}
                        </ul>
                      </div>
                      <div className="d-flex flex-row" style={{ width: '100%' }}>
                        <div className="flex-fill mr-2">
                          <Link
                            href="/station/[id]/track/[trackid]"
                            as={`/station/${props.channel.deeplink.toLowerCase()}/track/${play.track.id}`}
                          >
                            <a className="btn btn-light btn-sm btn-block border">
                              <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" /> Info
                            </a>
                          </Link>
                        </div>
                        {play.links && (
                          <div className="flex-fill">
                            <TrackLinks links={play.links} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 d-md-none mb-3">
                  <div className="row bg-light shadow-light radius-media-left radius-media-right ml-0 mr-0">
                    <div className="col-5 p-0">
                      <img src={albumCover} className="img-fluid radius-media-left" alt="..." />
                    </div>
                    <div className="col-7 pt-2 pb-3 px-3">
                      <div className="d-flex align-items-start flex-column" style={{ height: '100%' }}>
                        <div className="mb-auto" style={{ maxWidth: '100%' }}>
                          {props.secondaryText && <span className="text-secondary text-xs">{props.secondaryText(play)}</span>}

                          <h5 className="mt-0 mb-0 text-strong text-nowrap text-truncate">{play.track.name}</h5>
                          <ul className="list-inline mb-0" style={{ lineHeight: 1 }}>
                            {play.track.artists.map((artist, index) => (
                              <li
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                className="list-inline-item text-truncate"
                              >
                                <small>{artist}</small>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="d-flex flex-row" style={{ width: '100%' }}>
                          <div className="flex-fill mr-2">
                            <Link
                              href="/station/[id]/track/[trackid]"
                              as={`/station/${props.channel.deeplink.toLowerCase()}/track/${play.track.id}`}
                            >
                              <a className="btn btn-light btn-sm btn-block border">
                                <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" /> Info
                              </a>
                            </Link>
                          </div>
                          {play.links && (
                            <div className="flex-fill">
                              <TrackLinks links={play.links} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};
