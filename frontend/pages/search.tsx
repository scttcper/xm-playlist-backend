import Head from 'next/head';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { url } from '../url';

const Search = () => {
  const [artistName, setArtistName] = useState('orny');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const search = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    searchParams.append('artistName', artistName);
    const res = await fetch(`${url}/search?${searchParams.toString()}`);
    const results = await res.json();
    setSearchResults(results);
  };

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtistName(event.target.value.trim());
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
        <div className="relative max-w-xl mx-auto">
          <div className="bg-white rounded p-4 shadow">
            <h1 className="text-xl mb-4">Search</h1>
            <form onSubmit={search}>
              <div>
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
                    aria-describedby="email-description"
                    onChange={handleArtistChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500" id="email-description">
                  Case insensitive
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 mt-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
              >
                <FontAwesomeIcon className="mr-2" icon="search" />
                Go
              </button>
            </form>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md my-4">
          <ul>
            {searchResults?.map(result => {
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
                              <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
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
                                  {result.channel}
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

export default Search;
