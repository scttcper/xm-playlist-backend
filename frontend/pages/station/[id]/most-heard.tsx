import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import AdSense from 'react-adsense';
import ReactGA from 'react-ga';

import { channels } from 'frontend/channels';
import { AppLayout } from '../../../components/AppLayout';
import { StationTop } from '../../../components/StationTop';
import { StreamCardsLayout } from '../../../components/StreamCardsLayout';
import { StationNewest, TrackResponse } from '../../.frontend/responses';
import { url } from '../../../url';

interface StationProps {
  recent: StationNewest[][];
  channelId: string;
}

export default class MostHeard extends React.Component<StationProps> {
  state = { recent: [] };

  static async getInitialProps(context) {
    const id = context.query.id as string;
    const res = await fetch(`${url}/api/station/${id}/most-heard`);
    if (res.status !== 200) {
      return { recent: [], channelId: id };
    }

    try {
      const json = await res.json();
      return { recent: _.chunk(json, 12), channelId: id };
    } catch {
      return { recent: [], channelId: id };
    }
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
          <meta
            property="og:image"
            content={`https://xmplaylist.com/static/img/${channel.deeplink}-lg.png`}
          />
        </Head>
        <StationTop channel={channel} currentPage="most-heard" />
        <div className="container">
          <div className="row">
            <StreamCardsLayout
              tracks={recent}
              channel={channel}
              secondaryText={this.secondaryText}
            />
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
