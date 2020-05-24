import { formatDistanceStrict } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { NextComponentType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React, { useState } from 'react';
import AdSense from 'react-adsense';

import { channels } from '../../../channels';
import { StationTop } from 'components/StationTop';
import { StreamCardsLayout } from 'components/StreamCardsLayout';
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
    <>
      <Head>
        <title>{channel.name} Recently Played - sirius xm playlist</title>
        <meta
          property="og:image"
          content={`https://xmplaylist.com/static/img/${channel.deeplink}-lg.png`}
        />
      </Head>
      <StationTop channel={channel} currentPage="recent" />
      {/* Main body */}
      <main className="max-w-7xl mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-3">
        <div className="relative max-w-7xl mx-auto">
          <StreamCardsLayout tracks={recent} channel={channel} secondaryText={secondaryText} />
        </div>
        {/* Load More */}
        <div className="text-center my-5">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
            onClick={async () => fetchMore()}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </main>
      <div className="mx-auto adsbygoogle my-2">
        <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
      </div>
    </>
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
