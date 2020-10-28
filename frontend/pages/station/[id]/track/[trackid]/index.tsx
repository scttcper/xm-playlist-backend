import {
  LineSeries,
  PointSeries,
  Sparkline,
  VerticalReferenceLine,
  WithTooltip,
  PatternLines,
} from '@data-ui/sparkline';
import axios, { AxiosError } from 'axios';
import { NextComponentType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { format, formatDistanceStrict, formatISO } from 'date-fns';
import { useMeasure } from 'react-use';

import { channels } from '../../../../../channels';
import { Adsense } from 'components/Adsense';
import { SpotifyIframe } from 'components/SpotifyIframe';
import { TrackLinksButtons } from 'components/TrackLinksButtons';
import { TrackChannelResponse } from 'frontend/responses';
import { url } from '../../../../../url';

interface StationProps {
  channelId: string;
  trackData: TrackChannelResponse | null;
  error?: AxiosError;
}

const renderTooltip = ({ datum }) => (
  <div>
    {datum.x && <div>{datum.x}</div>}
    <div>Played {datum.y ? datum.y : '0'} times</div>
  </div>
);

const renderLabel = (d: any) => d;

const TrackPage: NextComponentType<any, any, StationProps> = ({ channelId, trackData }) => {
  const lowercaseId = channelId.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );

  const [ref, { width }] = useMeasure<HTMLDivElement>();

  if (!channel || !trackData) {
    return <Error statusCode={404} />;
  }

  const albumCover = trackData.spotify.cover || '/img/missing.png';
  const metaAlbumCover = trackData.spotify.cover || 'https://xmplaylist.com/img/missing.png';
  const description = `${trackData.track.name} by ${trackData.track.artists.join(' ')} on ${
    channel.name
  }`;

  return (
    <>
      <Head>
        <title>
          {trackData.track.name} on {channel.name}
        </title>
        <meta property="og:title" content={trackData.track.name} />
        <meta property="og:description" content={description} />
        <meta
          property="og:url"
          content={`https://xmplaylist.com/${channel.deeplink}/album/${trackData.track.id}`}
        />
        <meta property="og:image" content={metaAlbumCover} />
        <meta property="og:type" content="music.song" />

        <meta property="twitter:image" content={metaAlbumCover} />
        <meta property="twitter:title" content={trackData.track.name} />
        <meta property="twitter:description" content={description} />
        {trackData?.spotify?.spotify_id && (
          <>
            <meta property="twitter:app:id:iphone" content="324684580" />
            <meta property="twitter:app:id:googleplay" content="com.spotify.music" />
            <meta property="twitter:player:height" content="380" />
            <meta property="twitter:player:width" content="300" />
            <meta property="twitter:card" content="player" />
            <meta
              property="twitter:audio:artist_name"
              content={trackData.track.artists.join(' ')}
            />
            <meta
              property="twitter:player"
              content={`https://open.spotify.com/embed/track/${trackData.spotify.spotify_id}`}
            />
            <meta
              property="twitter:audio:source"
              content={`https://open.spotify.com/twitter/vmap/track/${trackData.spotify.spotify_id}`}
            />
          </>
        )}
      </Head>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 text-center adsbygoogle">
        <Adsense />
      </div>
      <div className="relative pt-4 md:pt-16 pb-20 px-2 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="lg:mt-4 max-w-lg mx-auto">
            <nav className="flex items-center text-sm leading-5 font-medium">
              <Link href="/station">
                <a className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
                  Stations
                </a>
              </Link>
              <svg
                className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
                <a>
                  <span className="text-gray-500 truncate">{channel.name}</span>
                </a>
              </Link>
              <svg
                className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-500 truncate">{trackData.track.name}</span>
            </nav>
            <div className="mt-3 flex flex-col rounded-lg border md:shadow-lg bg-white">
              <div className="flex-shrink-0">
                <img className="w-full object-cover" src={albumCover} alt="Album Cover" />
              </div>
              <div className="bg-white p-4 py-6 lg:p-8 lg:py-10 flex flex-col justify-between rounded-lg">
                <h3 className="text-xl sm:text-3xl md:leading-9 tracking-tight font-extrabold text-gray-900 sm:leading-10">
                  {trackData.track.name}
                </h3>
                <ul className="text-base md:max-w-2xl md:leading-7 text-gray-700 sm:mt-4">
                  {trackData.track.artists.map((artist, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index} className="inline pr-2">
                      {artist}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {trackData.spotify.spotify_id && (
            <div className="mt-3 max-w-lg mx-auto p-2 rounded-lg border md:shadow-lg bg-white">
              <SpotifyIframe track={trackData} />
            </div>
          )}
          {trackData.links.length > 0 && (
            <div className="mt-3 max-w-lg mx-auto p-3 rounded-lg border md:shadow-lg bg-white">
              <h4 className="text-center font-medium text-sm text-gray-900 leading-8 mb-3">
                Links
              </h4>
              <TrackLinksButtons links={trackData.links} id={trackData.track.id} />
            </div>
          )}
          {trackData.plays.some(play => play.y > 0) && (
            <div className="mt-3 max-w-lg py-2 pb-0 mx-auto rounded-lg rounded-b-none border md:shadow-lg bg-white">
              <h4 className="text-center font-medium text-sm text-gray-900 leading-8 mb-3">
                Times Played Per Day
              </h4>
              <div ref={ref} style={{ height: '80px' }}>
                <WithTooltip renderTooltip={renderTooltip}>
                  {({ onMouseMove, onMouseLeave, tooltipData }) => (
                    <Sparkline
                      ariaLabel="A line graph of randomly-generated data"
                      height={80}
                      width={width}
                      min={0}
                      data={trackData.plays}
                      margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                      onMouseLeave={onMouseLeave}
                      onMouseMove={onMouseMove}
                    >
                      <PatternLines
                        id="area_pattern"
                        height={4}
                        width={4}
                        stroke="#C5D9FC"
                        strokeWidth={2}
                        orientation={['diagonal']}
                      />
                      <LineSeries showArea stroke="#3f83f8" fill="url(#area_pattern)" />
                      {tooltipData && [
                        <VerticalReferenceLine
                          key="ref-line"
                          strokeWidth={1}
                          reference={tooltipData.index}
                          strokeDasharray="4 4"
                        />,
                        <PointSeries key="ref-point" points={[tooltipData.index]} fill="#3f83f8" />,
                      ]}
                    </Sparkline>
                  )}
                </WithTooltip>
              </div>
            </div>
          )}
          <div className="mt-3 max-w-lg p-2 md:p-3 pb-0 mx-auto rounded-lg border md:shadow-lg bg-white">
            <h4 className="text-center font-medium text-sm text-gray-900 leading-8 mb-2">
              Recent Plays - {trackData.track.name} on {channel.name}
            </h4>
            <ul className="pb-2 text-center">
              {trackData.recent.map(datetime => (
                <li key={datetime}>
                  <p className="text-sm text-gray-500 p-1">
                    {formatDistanceStrict(new Date(datetime), new Date(), { addSuffix: true })}
                    {' - '}
                    <time dateTime={formatISO(new Date(datetime))}>
                      {format(new Date(datetime), 'PPp')}
                    </time>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8 text-center adsbygoogle">
        <Adsense />
      </div>
    </>
  );
};

TrackPage.getInitialProps = async ({ query, req, res }) => {
  const trackId = query.trackid as string;
  const channelId = query.id as string;

  let headers: any;
  if (!process.browser) {
    res?.setHeader?.('Cache-Control', 'public, max-age=600, must-revalidate');
    headers = {
      'x-real-ip': req?.headers?.['x-real-ip'] ?? '',
    };
  }

  try {
    const response = await axios.get(`${url}/api/station/${channelId}/track/${trackId}`, {
      timeout: 15 * 1000,
      headers,
    });
    return { trackData: response.data, channelId };
  } catch (error) {
    return { trackData: null, channelId };
  }
};

export default TrackPage;
