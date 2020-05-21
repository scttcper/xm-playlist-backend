/* eslint-disable react/jsx-no-useless-fragment */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import AdSense from 'react-adsense';
import ReactGA from 'react-ga';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LazyLoad from 'react-lazyload';

import { Channel } from '../channels';
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
            <div className="adsbygoogle block">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          )}
          <div className="grid gap-2 mt-3 md:gap-3 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
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
                  <div className="flex flex-row rounded-lg shadow-sm overflow-hidden">
                    <div className="flex-shrink-0">
                      <LazyLoadImage src={albumCover} className="h-40 w-40" alt="..." />
                    </div>
                    <div className="flex-1 bg-white px-6 py-3 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-sm leading-5 font-medium text-indigo-600">
                          {props?.secondaryText?.(play)}
                        </p>

                        <h3 className="mt-2 text-lg md:text-xl lg:text-lg xl:text-xl leading-5 md:leading-6 font-semibold text-gray-900">
                          {play.track.name}
                        </h3>
                        <ul className="mt-1 text-sm md:text-base lg:text-sm xl:text-base md:leading-6 text-gray-500">
                          {play.track.artists.map((artist, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={index} className="inline pr-2">
                              {artist}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className="inline-flex rounded-md shadow-sm">
                          <Link
                            href="/station/[id]/track/[trackid]"
                            as={`/station/${props.channel.deeplink.toLowerCase()}/track/${
                              play.track.id
                            }`}
                          >
                            <a className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                              <LazyLoad>
                                <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" />{' '}
                                Info
                              </LazyLoad>
                            </a>
                          </Link>
                          {play.spotify && play.spotify.spotify_id && (
                            <>
                              <a
                                className="ml-2 hidden sm:inline-flex lg:hidden xl:inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                                href={spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackOut('spotify', play.track.id)}
                              >
                                <LazyLoad>
                                  <FontAwesomeIcon className="mr-1" icon={['fab', 'spotify']} />
                                </LazyLoad>{' '}
                                Spotify
                              </a>

                              <a
                                className="ml-2 hidden sm:inline-flex lg:hidden xl:inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                                href={apple}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackOut('apple', play.track.id)}
                              >
                                <LazyLoad>
                                  <FontAwesomeIcon className="mr-1" icon={['fab', 'apple']} />
                                </LazyLoad>{' '}
                                Apple
                              </a>
                            </>
                          )}
                          {play.links && play.links.length > 0 && (
                            <TrackLinks links={play.links} id={play.track.id} />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-4 col-lg-3 d-none d-md-block mb-3">
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
                </div> */}
                </React.Fragment>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};
