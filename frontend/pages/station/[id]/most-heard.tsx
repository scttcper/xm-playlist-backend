import axios from 'axios';
import _ from 'lodash';
import Error from 'next/error';
import Head from 'next/head';
import React, { useState } from 'react';

import { channels } from '../../../channels';
import { StationHeader } from 'components/StationHeader';
import { StreamCardsLayout } from 'components/StreamCardsLayout';
import { Adsense } from 'components/Adsense';
import { StationMostHeard, TrackResponse } from 'frontend/responses';
import { url } from '../../../url';
import { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router';

type Props = {
  recent: StationMostHeard[][];
  channelId: string;
};

const DEFAULT_SUB_DAYS = 30;

const MostHeard: NextComponentType<NextPageContext, Promise<Props>, Props> = ({
  channelId,
  recent,
}) => {
  const secondaryText = (track: TrackResponse): string => {
    return `Times Played: ${(track as StationMostHeard).plays}`;
  };

  const router = useRouter();
  const [subDays, setSubDays] = useState(router.query.subDays ?? DEFAULT_SUB_DAYS);
  const [tracks, setTracks] = useState(recent);

  const lowercaseId = channelId.toLowerCase();
  const channel = channels.find(
    channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
  );
  if (!channel) {
    return <Error statusCode={404} />;
  }

  async function fetchMostHeard(days: number) {
    setTracks([]);
    const query: Record<string, string> = {};
    const path = `/station/${lowercaseId}/most-heard`;
    let api = `${url}/api${path}`;
    if (days !== DEFAULT_SUB_DAYS) {
      query.subDays = days.toString();
      api += `?subDays=${days.toString()}`;
    }

    router.push(router.route, { pathname: path, query }, { shallow: true });
    const res = await axios.get(api, { timeout: 15 * 1000 });
    setTracks(_.chunk<any>(res.data, 12));
  }

  const handleSubDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const days = Number(event.target.value);
    setSubDays(days);
    fetchMostHeard(days);
  };

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
          <div className="flex justify-end mb-2">
            <div>
              <label
                htmlFor="subDays"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                In the last
              </label>
              <select
                id="subDays"
                className="mt-1 block form-select w-48 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                defaultValue={subDays}
                onChange={handleSubDaysChange}
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>
          <StreamCardsLayout tracks={tracks} channel={channel} secondaryText={secondaryText} />
        </div>
      </main>
      <div className="max-w-7xl md:px-4 sm:px-6 lg:px-8 mb-5 mx-auto adsbygoogle my-2">
        <Adsense />
      </div>
    </>
  );
};

MostHeard.getInitialProps = async ({ req, res, query }) => {
  const id = query.id as string;
  let api = `${url}/api/station/${id}/most-heard`;
  if (query.subDays) {
    api += `?subDays=${query.subDays as string}`;
  }

  let headers: any;
  if (!process.browser) {
    res?.setHeader?.('Cache-Control', 'public, max-age=600, must-revalidate');
    headers = {
      'x-real-ip': req?.headers?.['x-real-ip'] ?? '',
    };
  }

  try {
    const response = await axios.get(api, { timeout: 15 * 1000, headers });
    if (response.status !== 200) {
      return { recent: [], channelId: id };
    }

    const json = response.data as StationMostHeard[];
    const recent = _.chunk(json, 12);
    return { recent, channelId: id };
  } catch (error) {
    return { recent: [], channelId: id };
  }
};

export default MostHeard;
