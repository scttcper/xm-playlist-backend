import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useObserver } from 'mobx-react';

import { url } from '../url';
import { SearchForm, Inputs as SearchFormInputs } from 'components/SearchForm';
import { useStores } from 'services/useStores';
import { channels, Channel } from 'frontend/channels';

type Props = {
  query: any;
};

export interface SearchResult {
  id: string;
  scrobbleId: string;
  startTime: string;
  channel: string;
  name: string;
  artists: string[];
  createdAt: string;
  spotifyId: string;
  previewUrl: string;
  cover: string;
}

export interface SearchResults {
  stationsTotal: number;
  uniqueTracksTotal: number;
  totalItems: number;
  currentPage: number;
  pages: number;
  results: SearchResult[];
}

const friendlyChannelName = (deeplink: string): Channel | undefined =>
  channels.find(channel => channel.deeplink === deeplink);

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    user: user.user,
  }));
}

const Search: NextComponentType<NextPageContext, Props, Props> = ({ query }) => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Partial<SearchResults>>({ results: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserData();

  const search = async (data: SearchFormInputs) => {
    if (!user) {
      return;
    }

    const searchParams = new URLSearchParams();
    const query: Record<string, string> = {};
    setSearchResults({ results: [] });
    if (data.artistName) {
      query.artistName = data.artistName;
      searchParams.append('artistName', data.artistName);
    }

    if (data.station) {
      query.station = data.station;
      searchParams.append('station', data.station);
    }

    if (data.trackName) {
      query.station = data.trackName;
      searchParams.append('trackName', data.trackName);
    }

    router.push({
      pathname: '/search',
      query,
    });

    try {
      setIsLoading(true);
      const token: string = (await user?.getIdToken()) || '';
      const res = await axios.get(`${url}/api/search?${searchParams.toString()}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(res.data);
    } catch {
      // TODO: handle errors
    }

    setIsLoading(false);
  };

  // TODO: initial load auto-search?
  // useEffect(() => {
  //   console.log('firstLoad?')
  //   if (artistName) {
  //     search();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Head>
        <title>Search - xmplaylist.com recently played on xm radio</title>
      </Head>
      <div className="bg-green-600">
        <div className="max-w-screen-xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-green-800 text-white">
                <FontAwesomeIcon icon="search" size="lg" />
              </span>
              <p className="ml-3 font-medium text-white">
                Search feature is still under development
              </p>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-3">
        {/* search */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Search</h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                Find songs by artist name, station, and date range.
              </p>
              <p className="mt-2 text-sm leading-5 text-gray-500">Text is case insensitive</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <SearchForm
                isLoading={isLoading}
                trackName={query.trackName}
                artistName={query.artistName}
                station={query.station}
                user={user}
                onSubmit={search}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-600 mt-4">Summary</h3>
          <div className="mt-2 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow md:grid-cols-3">
            <div>
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">Total Results</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      {searchResults.totalItems || '—'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="border-t border-gray-200 md:border-0 md:border-l">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">
                    Number of Stations
                  </dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      {searchResults.stationsTotal || '—'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="border-t border-gray-200 md:border-0 md:border-l">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">Unique Tracks</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      {searchResults.uniqueTracksTotal || '—'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* results */}
        <h3 className="text-lg leading-6 font-medium text-gray-600 mt-4">Results</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md my-3">
          <ul>
            {searchResults.results?.map(result => {
              const dateStr = format(new Date(result.startTime), 'MM/dd/yyyy KK:mm aaa');
              return (
                <li key={result.scrobbleId}>
                  <Link
                    href="/station/[id]/track/[trackid]"
                    as={`/station/${result.channel.toLowerCase()}/track/${result.id}`}
                  >
                    <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded"
                              src={result.cover || '/static/missing.png'}
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                              <div className="text-sm leading-5 font-medium text-blue-600 truncate">
                                {result.name}
                              </div>
                              <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                <span className="truncate">{result.artists.join(', ')}</span>
                              </div>
                            </div>
                            <div className="hidden md:block">
                              <div>
                                <div className="text-sm leading-5 text-gray-900">{dateStr}</div>
                                <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                  {friendlyChannelName(result.channel)?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
};

Search.getInitialProps = async context => {
  const { query } = context;
  return { query };
};

export default Search;
