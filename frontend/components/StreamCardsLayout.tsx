/* eslint-disable react/jsx-no-useless-fragment */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import AdSense from 'react-adsense';
import ReactGA from 'react-ga';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LazyLoad from 'react-lazyload';

import { Channel } from 'frontend/channels';
import { TrackResponse } from 'frontend/responses';
import { TrackLinks } from './TrackLinks';

export const StreamCardsLayout: React.FC<{
  tracks: TrackResponse[][];
  channel: Channel;
  secondaryText?: (track: TrackResponse) => string;
}> = props => {
  const trackOut = (site: string, id: string): void => {
    ReactGA.event({
      category: 'MusicClick',
      action: site,
      label: id,
    });
  };

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
          {chunk.map((play, index) => {
            const albumCover = play.spotify.cover || '/static/missing.png';
            let spotify: undefined | string;
            let apple: undefined | string;
            if (play.links) {
              spotify = play.links.find(n => n.site === 'spotify')?.url;
              apple = play.links.find(n => n.site === 'itunes')?.url;
            }

            return (
              <React.Fragment key={play.track.id + index.toString()}>
                <div className="col-4 col-lg-3 d-none d-md-block mb-3">
                  <div className="card h-100 shadow-sm border-0">
                    <LazyLoadImage src={albumCover} className="card-img-top" alt="..." />
                    <div className="card-body d-flex align-items-start flex-column">
                      <div className="mb-auto pb-4" style={{ maxWidth: '100%' }}>
                        {props.secondaryText && (
                          <small className="text-secondary">{props.secondaryText(play)}</small>
                        )}
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
                      <div className="d-flex flex-row mb-2" style={{ width: '100%' }}>
                        <div className="flex-fill">
                          <Link
                            href="/station/[id]/track/[trackid]"
                            as={`/station/${props.channel.deeplink.toLowerCase()}/track/${
                              play.track.id
                            }`}
                          >
                            <a className="btn btn-light btn-sm btn-block border">
                              <LazyLoad>
                                <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" />
                              </LazyLoad>{' '}
                              Info
                            </a>
                          </Link>
                        </div>
                        {play.links && play.links.length > 0 && (
                          <div className="flex-fill ml-2">
                            <TrackLinks links={play.links} id={play.track.id} />
                          </div>
                        )}
                      </div>
                      {play.spotify && play.spotify.spotify_id && (
                        <div className="d-flex flex-row" style={{ width: '100%' }}>
                          <div className="flex-fill mr-2">
                            <a
                              className="btn btn-light btn-sm btn-block border"
                              href={spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackOut('spotify', play.track.id)}
                            >
                              <LazyLoad>
                                <FontAwesomeIcon icon={['fab', 'spotify']} />
                              </LazyLoad>{' '}
                              Spotify
                            </a>
                          </div>
                          <div className="flex-fill">
                            <a
                              className="btn btn-light btn-sm btn-block border"
                              href={apple}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackOut('apple', play.track.id)}
                            >
                              <LazyLoad>
                                <FontAwesomeIcon icon={['fab', 'apple']} />
                              </LazyLoad>{' '}
                              Apple
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 d-md-none mb-3">
                  <div className="row bg-light shadow-light radius-media-left radius-media-right ml-0 mr-0">
                    <div className="col-5 p-0">
                      <LazyLoadImage
                        src={albumCover}
                        className="img-fluid radius-media-left"
                        alt="..."
                      />
                    </div>
                    <div className="col-7 pt-2 pb-3 px-3">
                      <div
                        className="d-flex align-items-start flex-column"
                        style={{ height: '100%' }}
                      >
                        <div className="mb-auto" style={{ maxWidth: '100%' }}>
                          {props.secondaryText && (
                            <span className="text-secondary text-xs">
                              {props.secondaryText(play)}
                            </span>
                          )}

                          <h5 className="mt-0 mb-0 text-strong text-nowrap text-truncate">
                            {play.track.name}
                          </h5>
                          <ul className="list-inline mb-0">
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
                          <div className="flex-fill">
                            <Link
                              href="/station/[id]/track/[trackid]"
                              as={`/station/${props.channel.deeplink.toLowerCase()}/track/${
                                play.track.id
                              }`}
                            >
                              <a className="btn btn-light btn-sm btn-block border">
                                <LazyLoad>
                                  <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" />
                                </LazyLoad>{' '}
                                Info
                              </a>
                            </Link>
                          </div>
                          {play.links && play.links.length > 0 && (
                            <div className="flex-fill ml-2">
                              <TrackLinks links={play.links} id={play.track.id} />
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
