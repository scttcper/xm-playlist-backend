import React, { useState } from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AppLayout } from '../components/AppLayout';
import { channels, Channel, Genre } from '../channels';
import { GenrePicker } from 'components/GenrePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const allResultsFuse = () =>
  new Fuse(channels, {
    threshold: 1,
    distance: 2,
    keys: ['name'],
  });

export const Home: React.FC = () => {
  const [currentChannels, setCurrentChannels] = useState(channels);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [fuse, setFuse] = useState(allResultsFuse());
  const [currentQuery, setQuery] = useState('');

  const handleGenreChange = (genre: Genre): void => {
    const filteredChannels = channels.filter(channel => channel.genre === genre);
    setFuse(
      new Fuse(filteredChannels, {
        threshold: 1,
        distance: 2,
        keys: ['name'],
      }),
    );
    setCurrentChannels(filteredChannels);
    setCurrentGenre(genre);
  };

  const handleKeyUp = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = (event.target as HTMLInputElement).value;
    if (query.trim()) {
      setQuery(query);
    } else {
      setQuery('');
    }
  };

  const resetAll = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    (event.target as HTMLFormElement).reset();
    setCurrentChannels(channels);
    setFuse(allResultsFuse());
    setCurrentGenre(null);
  };

  let results: Channel[];
  if (currentQuery) {
    results = fuse.search(currentQuery, { limit: 15 }).map(result => result.item);
  } else {
    results = currentChannels;
  }

  return (
    <AppLayout hasNav={false}>
      <div className="pt-6 pb-24 mx-auto px-4 sm:pt-12 sm:px-6 md:pt-10 bg-gray-800">
        <div className="text-center">
          <h2 className="text-4xl tracking-tight font-sans font-extrabold text-gray-200 sm:text-3xl sm:leading-none md:text-5xl">
            xmplaylist
          </h2>
          <p className="mt-3 mx-auto text-base text-gray-300 sm:text-lg md:mt-5 xl:text-xl">
            Recently played songs on XM Sirius radio
          </p>
        </div>
      </div>
      <main className="-mt-16">
        <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            {/* filters */}
            <form onSubmit={resetAll}>
              <div className="justify-center md:justify-start flex mb-5">
                {/* input */}
                <div className="flex-grow md:flex-initial md:w-4/12 lg:w-3/12 mr-1">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="text"
                      className="form-input block w-full text-sm leading-5 py-2"
                      placeholder="Filter Stations"
                      onChange={handleKeyUp}
                    />
                  </div>
                </div>
                {/* dropdown */}
                <div className="flex-grow-0 mr-1">
                  <GenrePicker pickGenre={handleGenreChange} currentGenre={currentGenre} />
                </div>
                {/* reset */}
                <div className="flex-grow-0">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                  >
                    <FontAwesomeIcon className="h-5 w-5" size="sm" icon="times" />
                  </button>
                </div>
              </div>
            </form>

            {/* channels */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map(channel => (
                <div key={channel.id} className="text-gray-800 hover:text-indigo-800">
                  <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
                    <a>
                      <div>
                        <div className="transition duration-500 ease-in-out bg-gray-900 hover:bg-gray-700 transform rounded-lg p-3 md:p-5">
                          <LazyLoadImage
                            src={`/static/img/${channel.deeplink}-lg.png`}
                            className="card-img-top"
                            alt={`${channel.name} Logo`}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-center text-base lg:text-lg leading-6 font-medium ">
                          {channel.name}
                        </h3>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="container-fluid text-white text-center bg-dark pb-5 pt-2">
        <div className="row">
          <div className="col-12">
            <div className="jumbotron p-4 rounded">
              <h1 className="display-4">xmplaylist</h1>
              <p className="mb-1">Recently played songs on XM Sirius radio</p>
              <p className="text-muted">
                Created by{' '}
                <a
                  className="text-muted"
                  href="https://twitter.com/scttcper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @scttcper
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="row adsbygoogle my-2">
          <div className="col-12">
            <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
