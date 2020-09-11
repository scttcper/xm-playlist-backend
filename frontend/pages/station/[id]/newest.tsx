import { formatDistanceStrict, format } from 'date-fns';
import axios from 'axios';
import _ from 'lodash';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import { NextPageContext, NextComponentType } from 'next';

import { channels } from '../../../channels';
import { Adsense } from 'components/Adsense';
import { StationHeader } from 'components/StationHeader';
import { StreamCardsLayout } from 'components/StreamCardsLayout';
import { StationNewest, TrackResponse } from 'frontend/responses';
import { url } from '../../../url';

type Props = {
  recent: StationNewest[][];
  channelId: string;
};

const secondaryText = (track: TrackResponse): React.ReactNode => {
  const date = new Date(track.track.created_at);
  const timeAgo = formatDistanceStrict(date, new Date(), {
    addSuffix: true,
  });

  return (
    <span>
      First Heard:{' '}
      <time title={format(date, 'PPpp')} dateTime={date.toISOString()}>
        {timeAgo}
      </time>
    </span>
  );
};

const Newest: NextComponentType<NextPageContext, Promise<Props>, Props> = ({
  recent,
  channelId,
}) => {
  const lowercaseId = channelId.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );
  if (!channel) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{channel.name} Newest Songs - sirius xm playlist</title>
        <meta
          property="og:image"
          content={`https://xmplaylist.com/static/img/${channel.deeplink}-lg.png`}
        />
      </Head>
      <StationHeader channel={channel} currentPage="newest" />
      <main className="max-w-7xl mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-3">
        <div className="relative max-w-7xl mx-auto">
          <StreamCardsLayout tracks={recent} channel={channel} secondaryText={secondaryText} />
        </div>
      </main>
      <div className="max-w-7xl md:px-4 sm:px-6 lg:px-8 mb-5 mx-auto adsbygoogle my-2">
        <Adsense />
      </div>
    </>
  );
};

Newest.getInitialProps = async ({ query, req }) => {
  const id = query.id as string;

  const headers = process.browser ? undefined : {
    'x-real-id': req?.headers?.['x-real-ip'] ?? '',
  };

  try {
    const res = await axios.get(`${url}/api/station/${id}/newest`, { timeout: 15 * 1000, headers });
    const json = res.data as StationNewest[];
    return { recent: _.chunk(json, 12), channelId: id };
  } catch (error) {
    return { recent: [], channelId: id };
  }
};

export default Newest;
