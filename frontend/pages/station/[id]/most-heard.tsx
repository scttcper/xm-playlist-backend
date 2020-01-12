import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { NextPageContext } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import AdSense from 'react-adsense';
import ReactGA from 'react-ga';

import { AppLayout } from '../../../components/AppLayout';
import { StationHeader } from '../../../components/StationHeader';
import { StationNavigation } from '../../../components/StationNavigation';
import { channels } from '../../../channels';
import { StationNewest, TrackResponse } from '../../../responses';
import { StreamCardsLayout } from '../../../components/StreamCardsLayout';
import { url } from '../../../url';

interface StationProps {
  recent: StationNewest[][];
  channelId: string;
}

interface Context extends NextPageContext {
  id: string;
  recent: StationNewest[][];
}

export default class Station extends React.Component<StationProps> {
  state = { recent: [] };

  static async getInitialProps(context: Context): Promise<StationProps> {
    const id = context.query.id as string;
    const res = await fetch(`${url}/api/station/${id}/most-heard`);
    const json = await res.json();
    return { recent: _.chunk(json, 12), channelId: id };
  }

  trackPlaylistClick(type: string): void {
    ReactGA.event({
      category: 'Playlist',
      action: type,
      label: this.props.channelId,
    });
  }

  secondaryText(track: TrackResponse): string {
    return `Times Played: ${(track as StationNewest).plays}`;
  }

  render(): JSX.Element {
    const lowercaseId = this.props.channelId.toLowerCase();
    const channel = channels.find(
      channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
    );
    if (!channel) {
      return <Error statusCode={404} />;
    }

    const recent = [...this.props.recent, ...this.state.recent];

    return (
      <AppLayout>
        <Head>
          <title>{channel.name} Most Played - sirius xm playlist</title>
        </Head>
        <div className="bg-light">
          <div className="container pt-2" style={{ paddingBottom: '2.5rem' }}>
            <div className="row">
              <div className="col-12 col-lg-6">
                <StationHeader channel={channel} />
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-1" style={{ marginTop: '-1.8rem' }}>
          <div className="row">
            <div className="col-12 mb-2">
              <a
                href={`https://open.spotify.com/user/xmplaylist/playlist/${channel.playlist}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => this.trackPlaylistClick('spotify')}
              >
                <div className="bg-white text-dark shadow rounded p-3 d-flex justify-content-start">
                  <div className="">
                    <FontAwesomeIcon className="mr-2" style={{ color: '#000' }} icon={['fab', 'spotify']} size="lg" />
                  </div>
                  <div className="mr-auto">{channel.name} playlist on Spotify</div>
                  <div>
                    <FontAwesomeIcon size="sm" icon="external-link-alt" />
                  </div>
                </div>
              </a>
            </div>
            {/* <div className="col-12 col-md-6 mb-2">
              <a href={`https://open.spotify.com/user/xmplaylist/playlist/${channel.playlist}`} target="_blank" rel="noopener noreferrer">
                <div className="bg-white text-dark shadow rounded p-3 d-flex justify-content-start">
                  <div className="">
                    <FontAwesomeIcon className="mr-2" style={{ color: '#000' }} icon={['fab', 'apple']} size="lg" />
                  </div>
                  <div className="mr-auto">{channel.name} playlist on Apple Music</div>
                  <div>
                    <FontAwesomeIcon size="sm" icon="external-link-alt" />
                  </div>
                </div>
              </a>
            </div> */}
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
              <StationNavigation channelId={channel.id} currentPage="most-heard" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <StreamCardsLayout tracks={recent} channel={channel} secondaryText={this.secondaryText} />
          </div>
        </div>
        <div className="container adsbygoogle mb-5">
          <div className="row">
            <div className="col">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
