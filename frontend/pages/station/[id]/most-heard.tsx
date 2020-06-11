import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import Adsense from 'react-adsense';

import { channels } from '../../../channels';
import { StationHeader } from '../../../components/StationHeader';
import { StreamCardsLayout } from '../../../components/StreamCardsLayout';
import { StationNewest, TrackResponse } from 'frontend/responses';
import { url } from '../../../url';
import { NextComponentType, NextPageContext } from 'next';

type Props = {
  recent: StationNewest[][];
  channelId: string;
};

const MostHeard: NextComponentType<NextPageContext, Promise<Props>, Props> = ({
  channelId,
  recent,
}) => {
  const secondaryText = (track: TrackResponse): string => {
    return `Times Played: ${(track as StationNewest).plays}`;
  };

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
        <title>{channel.name} Most Played - sirius xm playlist</title>
        <meta
          property="og:image"
          content={`https://xmplaylist.com/static/img/${channel.deeplink}-lg.png`}
        />
      </Head>
      <StationHeader channel={channel} currentPage="most-heard" />
      <main className="max-w-7xl mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-3">
        <div className="relative max-w-7xl mx-auto">
          <StreamCardsLayout tracks={recent} channel={channel} secondaryText={secondaryText} />
        </div>
      </main>
      <div className="max-w-7xl mx-auto adsbygoogle my-2">
        <Adsense.Google client="ca-pub-7640562161899788" slot="5645069928" />
      </div>
    </>
  );
};

MostHeard.getInitialProps = async context => {
  const id = context.query.id as string;
  const res = await fetch(`${url}/api/station/${id}/most-heard`);
  if (res.status !== 200) {
    return { recent: [], channelId: id };
  }

  try {
    const json = (await res.json()) as StationNewest[];
    const recent = _.chunk(json, 12);
    return { recent, channelId: id };
  } catch {
    return { recent: [], channelId: id };
  }
};

export default MostHeard;
