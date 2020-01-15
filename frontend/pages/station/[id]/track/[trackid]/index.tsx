import { NextPageContext } from 'next';
import fetch from 'isomorphic-unfetch';
import Error from 'next/error';
import Router from 'next/router';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdSense from 'react-adsense';
import {
  Sparkline,
  LineSeries,
  WithTooltip,
  PatternLines,
  PointSeries,
  VerticalReferenceLine,
} from '@data-ui/sparkline';
import { allColors } from '@data-ui/theme';
import { SizeMe } from 'react-sizeme';
import Head from 'next/head';

import { AppLayout } from '../../../../../components/AppLayout';
import { channels } from '../../../../../channels';
import { TrackChannelResponse } from '../../../../../responses';
import { TrackLinksButtons } from '../../../../../components/TrackLinksButtons';
import { url } from '../../../../../url';
import { SpotifyIframe } from '../../../../../components/SpotifyIframe';

interface StationProps {
  channelId: string;
  trackData: TrackChannelResponse;
}

interface Context extends NextPageContext {
  id: string;
  trackid: string;
}

const renderTooltip = ({ datum }) => (
  <div>
    {datum.x && <div>{datum.x}</div>}
    <div>Played {datum.y ? datum.y : '0'} times</div>
  </div>
);

const renderLabel = d => d;

export default class Station extends React.Component<StationProps> {
  static async getInitialProps(context: Context): Promise<StationProps> {
    const trackId = context.query.trackid as string;
    const channelId = context.query.id as string;
    const res = await fetch(`${url}/api/station/${channelId}/track/${trackId}`);
    const json = await res.json();
    return { trackData: json, channelId };
  }

  render(): JSX.Element {
    const lowercaseId = this.props.channelId.toLowerCase();
    const channel = channels.find(
      channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
    );
    if (!channel || !this.props.trackData) {
      return <Error statusCode={404} />;
    }

    const { trackData } = this.props;
    const albumCover = trackData.spotify.cover || '/static/missing.png';
    const metaAlbumCover = trackData.spotify.cover || 'https://xmplaylist.com/static/missing.png';

    return (
      <AppLayout>
        <Head>
          <title>{trackData.track.name} on {channel.name}</title>
          <meta property="og:image" content={metaAlbumCover} />
        </Head>
        <div className="container my-3 adsbygoogle">
          <div className="row  mb-5">
            <div className="col-12 text-center">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          </div>
        </div>
        <div className="container my-3">
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 mb-2">
              <a className="btn btn-light rounded-pill" onClick={() => Router.back()}>
                <FontAwesomeIcon icon="arrow-left" /> Back
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 mb-3">
              <div className="row bg-light shadow-light radius-media-left radius-media-right ml-0 mr-0">
                <div className="col-5 p-0">
                  <img src={albumCover} className="img-fluid radius-media-left" alt="..." />
                </div>
                <div className="col-7 p-3">
                  <div className="d-flex align-items-start flex-column" style={{ height: '100%' }}>
                    <div className="mb-auto" style={{ maxWidth: '100%' }}>
                      <h4 className="mt-0 mb-2 text-strong">{trackData.track.name}</h4>
                      <ul className="list-inline mb-0" style={{ lineHeight: 1 }}>
                        {trackData.track.artists.map((artist, index) => (
                          <li
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className="list-inline-item text-truncate"
                          >
                            {artist}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 mb-3">
              <div className="rounded bg-light shadow-light pt-3 overflow-hidden">
                <h4 className="text-center">Times Played Per Day</h4>
                <SizeMe>
                  {({ size }) => (
                    <WithTooltip renderTooltip={renderTooltip}>
                      {({ onMouseMove, onMouseLeave, tooltipData }) => (
                        <Sparkline
                          ariaLabel="A line graph of randomly-generated data"
                          height={80}
                          width={size.width}
                          data={trackData.plays}
                          margin={{ top: 10, right: 2, bottom: 5, left: 4 }}
                          onMouseLeave={onMouseLeave}
                          onMouseMove={onMouseMove}
                        >
                          <PatternLines
                            id="area_pattern"
                            height={4}
                            width={4}
                            stroke={allColors.indigo[4]}
                            strokeWidth={1}
                            orientation={['diagonal']}
                          />
                          <LineSeries showArea stroke={allColors.indigo[5]} fill="url(#area_pattern)" />
                          <PointSeries points={['all']} stroke={allColors.indigo[4]} fill="#fff" size={3} />
                          <PointSeries
                            points={['last']}
                            fill={allColors.indigo[5]}
                            renderLabel={renderLabel}
                            labelPosition="right"
                          />
                          {tooltipData && [
                            <VerticalReferenceLine
                              key="ref-line"
                              strokeWidth={1}
                              reference={tooltipData.index}
                              strokeDasharray="4 4"
                            />,
                            <PointSeries key="ref-point" points={[tooltipData.index]} fill={allColors.indigo[5]} />,
                          ]}
                        </Sparkline>
                      )}
                    </WithTooltip>
                  )}
                </SizeMe>
              </div>
            </div>
          </div>
          {trackData.spotify.spotify_id && (
            <div className="row">
              <div className="col-12 col-md-6 offset-md-3 mb-3">
                <div className="rounded bg-light shadow-light p-2" style={{ lineHeight: 0 }}>
                  <SpotifyIframe track={trackData} />
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3 mb-3">
              <div className="rounded bg-light shadow-light p-3">
                <h4 className="text-center">Links</h4>
                <TrackLinksButtons links={trackData.links} />
              </div>
            </div>
          </div>
        </div>
        <div className="container my-3 adsbygoogle">
          <div className="row  mb-5">
            <div className="col-12 text-center">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
