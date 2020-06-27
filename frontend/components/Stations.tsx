import React, { useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { channels, Channel, Genre } from '../channels';
import { GenrePicker } from 'components/GenrePicker';

const fuseConfig = {
  threshold: 0.3,
  keys: ['name'],
};

const allResultsFuse = () => new Fuse(channels, fuseConfig);

export const Stations: React.FC = () => {
  const [currentChannels, setCurrentChannels] = useState(channels);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [fuse, setFuse] = useState(allResultsFuse());
  const [currentQuery, setQuery] = useState('');

  const handleGenreChange = (genre: Genre): void => {
    const filteredChannels = channels.filter(channel => channel.genre === genre);
    setFuse(new Fuse(filteredChannels, fuseConfig));
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
    <>
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-4">
        {results.map(channel => (
          <div key={channel.id} className="text-cool-gray-800 hover:text-blue-800">
            <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
              <a>
                <div className="duration-500 ease-in-out bg-cool-gray-900 hover:bg-cool-gray-700 transform rounded-lg p-3 md:p-5">
                  <img
                    src={`/static/img/${channel.deeplink}-lg.png`}
                    loading="lazy"
                    alt={`${channel.name} Logo`}
                    width={720}
                    height={720}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-center truncate text-sm md:text-lg leading-6 font-medium ">
                    {channel.name}
                  </h3>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
