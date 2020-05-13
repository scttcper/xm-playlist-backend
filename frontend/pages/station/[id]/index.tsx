import { formatDistanceStrict } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { NextComponentType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React, { useState } from 'react';
import AdSense from 'react-adsense';

import { channels } from '../../../channels';
import { AppLayout } from '../../../components/AppLayout';
import { StationTop } from '../../../components/StationTop';
import { StreamCardsLayout } from '../../../components/StreamCardsLayout';
import { StationRecent, TrackResponse } from 'frontend/responses';
import { url } from '../../../url';

interface StationProps {
  recent: StationRecent[][];
  channelId: string;
}

function getLastStartTime(recent: StationRecent[]): number {
  const last = recent[recent.length - 1].start_time;
  return new Date(last).getTime();
}

const StationPage: NextComponentType<any, any, StationProps> = props => {
  const { channelId } = props;
  const lowercaseId = channelId.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );

  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<StationRecent[][]>(props.recent);

  if (!channel) {
    return <Error statusCode={404} />;
  }

  async function fetchMore(): Promise<void> {
    setLoading(true);
    const lastDateTime = getLastStartTime(recent[recent.length - 1]);
    const res = await fetch(`${url}/api/station/${channelId}?last=${lastDateTime}`);
    const json = await res.json();
    setLoading(false);
    setRecent([...recent, ..._.chunk<any>(json, 12)]);
  }

  function secondaryText(track: TrackResponse): string {
    const timeAgo = formatDistanceStrict(
      new Date((track as StationRecent).start_time),
      new Date(),
      {
        addSuffix: true,
      },
    );
    return timeAgo;
  }

  return (
    <AppLayout>
      <Head>
        <title>{channel.name} Recently Played - sirius xm playlist</title>
        <meta
          property="og:image"
          content={`https://xmplaylist.com/static/img/${channel.deeplink}-lg.png`}
        />
      </Head>
      <StationTop channel={channel} currentPage="recent" />
      {/* Main body */}
      <div className="container mb-4">
        <div className="row">
          <StreamCardsLayout tracks={recent} channel={channel} secondaryText={secondaryText} />
        </div>
        {/* Load More */}
        <div className="row text-center">
          <div className="col-12">
            <button type="button" className="btn btn-primary" onClick={async () => fetchMore()}>
              {loading ? 'Loading..' : 'Load More'}
            </button>
          </div>
        </div>
      </div>
      <div className="container adsbygoogle mb-5">
        <div className="row">
          <div className="col-12">
            <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

StationPage.getInitialProps = async context => {
  const id = context.query?.id as string;
  const res = await fetch(`${url}/api/station/${id}`);

  const lowercaseId = id.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );

  if (!channel) {
    return { recent: [], channelId: id };
  }

  try {
    const json = await res.json();
    return { recent: _.chunk(json, 12), channelId: id };
  } catch {
    return { recent: [], channelId: id };
  }
};

export default StationPage;
