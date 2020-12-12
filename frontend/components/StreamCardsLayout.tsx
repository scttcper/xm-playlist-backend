import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import ReactGA from 'react-ga';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useWindowScroll } from 'react-use';

import { Adsense } from './Adsense';
import { Channel } from '../channels';
import { TrackResponse } from 'frontend/responses';
import { TrackLinks } from './TrackLinks';

export const StreamCardsLayout: React.FC<{
  tracks: TrackResponse[][];
  channel: Channel;
  secondaryText: (track: TrackResponse) => React.ReactNode;
}> = props => {
  const scrollPosition = useWindowScroll();

  const trackOut = (site: string, id: string): void => {
    ReactGA.event({
      category: 'MusicClick',
      action: site,
      label: id,
    });
  };

  return (
    <div>
      {props.tracks.map((chunk, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          {index > 0 && <Adsense />}
          <div className="grid gap-2 mt-3 md:gap-3 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
            {chunk.map((play, index) => {
              const albumCover = play.spotify.cover || '/img/missing.png';
              const spotify = play.spotify
                ? `https://open.spotify.com/track/${play.spotify.spotify_id}`
                : play.links.find(n => n.site === 'spotify')?.url;
              let apple: undefined | string;
              if (play.links) {
                apple = play.links.find(n => n.site === 'itunes')?.url;
              }

              const spotifyBackup = spotify ? [{ site: 'spotify', url: spotify }] : [];
              const links = play.links?.length ? play.links : spotifyBackup;

              return (
                <div
                  key={play.track.id + index.toString()}
                  className="flex flex-row rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex-shrink-0">
                    <LazyLoadImage
                      scrollPosition={scrollPosition}
                      src={albumCover}
                      className="h-40 w-40"
                      visibleByDefault={index === 0}
                      alt={`${play.track.name} album cover`}
                    />
                  </div>
                  <div className="flex-1 bg-white px-3 py-3 pl-4 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm leading-5 font-medium text-blue-500">
                        {props.secondaryText(play)}
                      </p>

                      <h3 className="mt-2 text-lg md:text-xl lg:text-lg xl:text-xl leading-5 md:leading-6 font-semibold text-gray-900">
                        {play.track.name}
                      </h3>
                      <ul className="mt-1 text-sm md:text-base lg:text-sm xl:text-base md:leading-6 text-cool-gray-500">
                        {play.track.artists.map((artist, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li key={index} className="inline pr-2">
                            {artist}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex rounded-md shadow-sm">
                        <Link
                          href="/station/[id]/track/[trackid]"
                          as={`/station/${props.channel.deeplink.toLowerCase()}/track/${
                            play.track.id
                          }`}
                        >
                          <a className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                            <FontAwesomeIcon icon="info-circle" className="mr-1.5" /> Info
                          </a>
                        </Link>
                        {play?.spotify?.spotify_id && (
                          <a
                            className="ml-1.5 hidden sm:inline-flex lg:hidden xl:inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                            href={spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackOut('spotify', play.track.id)}
                          >
                            <FontAwesomeIcon className="mr-1.5" icon={['fab', 'spotify']} />
                            Spotify
                          </a>
                        )}
                        {apple && (
                          <a
                            className="ml-1.5 hidden sm:inline-flex lg:hidden xl:inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                            href={apple.replace(
                              'https://music.apple.com',
                              'https://geo.music.apple.com',
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackOut('apple', play.track.id)}
                          >
                            <FontAwesomeIcon className="mr-1.5" icon={['fab', 'apple']} />
                            Apple
                          </a>
                        )}
                        {links.length > 0 && <TrackLinks links={links} id={play.track.id} />}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
