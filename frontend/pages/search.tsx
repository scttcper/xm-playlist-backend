import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { channels, Channel } from 'frontend/channels';

import { url } from '../url';

type Props = {
  query: any;
};

const friendlyChannelName = (deeplink: string): Channel | undefined =>
  channels.find(channel => channel.deeplink === deeplink);

const Search: NextComponentType<NextPageContext, Props, Props> = ({ query }) => {
  const router = useRouter();
  const [artistName, setArtistName] = useState<string>((query.artistName as string) || '');
  const [searchResults, setSearchResults] = useState<any>({ results: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<string>(query.station);

  const search = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const searchParams = new URLSearchParams();
    const query: Record<string, string> = {};
    setSearchResults({ result: [] });
    if (artistName) {
      query.artistName = artistName;
      searchParams.append('artistName', artistName);
    }

    if (selectedStation) {
      query.station = selectedStation;
      searchParams.append('station', selectedStation);
    }

    router.push({
      pathname: '/search',
      query,
    });

    try {
      setIsLoading(true);
      const res = await axios.get(`${url}/search?${searchParams.toString()}`);
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

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtistName(event.target.value.trim());
  };

  const handleStationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStation(event.target.value);
  };

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
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={search}>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="artist"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      Artist Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="artist"
                        className="form-input block w-full sm:text-sm sm:leading-5"
                        placeholder=""
                        aria-describedby="artist-name-description"
                        defaultValue={artistName}
                        onChange={handleArtistChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500" id="artist-name-description">
                      Case insensitive
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="station"
                      className="block text-sm leading-5 font-medium text-gray-700"
                    >
                      Station
                    </label>
                    <select
                      name="station"
                      id="station"
                      className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-400"
                      value={selectedStation}
                      onChange={handleStationChange}
                    >
                      <option value="">All Stations</option>
                      {channels
                        .sort((a, b) => a.number - b.number)
                        .map(channel => (
                          <option key={channel.deeplink} value={channel.deeplink}>
                            {channel.number} - {channel.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 mt-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                  >
                    {isLoading && (
                      <>
                        <FontAwesomeIcon spin className="mr-2" icon="spinner" /> Loading...
                      </>
                    )}
                    {!isLoading && (
                      <>
                        <FontAwesomeIcon className="mr-2" icon="search" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-600 mt-4">Summary</h3>
          <div className="mt-2 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow md:grid-cols-3">
            <div>
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">
                    Total Subscribers
                  </dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      71,897
                      <span className="ml-2 text-sm leading-5 font-medium text-gray-500">
                        from 70,946
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="border-t border-gray-200 md:border-0 md:border-l">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">Avg. Open Rate</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      58.16%
                      <span className="ml-2 text-sm leading-5 font-medium text-gray-500">
                        from 56.14%
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="border-t border-gray-200 md:border-0 md:border-l">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-base leading-6 font-normal text-gray-900">Avg. Click Rate</dt>
                  <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div className="flex items-baseline text-2xl leading-8 font-semibold text-blue-600">
                      24.57%
                      <span className="ml-2 text-sm leading-5 font-medium text-gray-500">
                        from 28.62
                      </span>
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
                                  {friendlyChannelName(result.channel).name}
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
