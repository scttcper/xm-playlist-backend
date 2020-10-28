import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import { channels, Channel, Genre } from '../channels';
import { GenrePicker } from 'components/GenrePicker';
import { useEffect } from 'react';

const fuseConfig = {
  threshold: 0.3,
  keys: ['name'],
};

const allResultsFuse = () => new Fuse(channels, fuseConfig);

type Props = {
  autoFocus: boolean;
};

export const Stations = ({ autoFocus }: Props) => {
  const router = useRouter();
  const [currentChannels, setCurrentChannels] = useState(channels);
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [fuse, setFuse] = useState(allResultsFuse());
  const [currentQuery, setQuery] = useState((router.query.q as string) || '');
  const formRef = React.useRef<any>();

  useEffect(() => {
    setQuery(router.query.q as string);
    setCurrentGenre(router.query.genre as string);
  }, [router]);

  useEffect(() => {
    const filteredChannels = currentGenre
      ? channels.filter(channel => channel.genre === currentGenre)
      : channels;
    setCurrentChannels(filteredChannels);
    setFuse(new Fuse(filteredChannels, fuseConfig));
  }, [currentGenre]);

  const getQueryParms = (query?: string, genre?: string | null) => {
    const params: any = {
      q: query || undefined,
      genre: genre || undefined,
    };

    for (const propName of Object.keys(params)) {
      if (params[propName] === null || params[propName] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[propName];
      }
    }

    return params;
  };

  const handleGenreChange = (genre: Genre | null): void => {
    router.replace({
      pathname: '/station',
      query: getQueryParms(currentQuery, genre),
    });
  };

  const handleKeyUp = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = (event.target as HTMLInputElement).value.trim();

    router.replace({
      pathname: '/station',
      query: getQueryParms(query, currentGenre),
    });
  };

  const resetAll = (): void => {
    formRef.current.reset();
    setCurrentChannels(channels);
    setFuse(allResultsFuse());
    setCurrentGenre(null);
    router.replace({
      pathname: '/station',
      query: {},
    });
  };

  const pickFirstEvent = (event: React.FormEvent): void => {
    event.preventDefault();
    if (results.length === 0) {
      return;
    }

    router.push(`/station/${results[0].deeplink.toLowerCase()}`);
  };

  let results: Channel[];
  if (currentQuery) {
    results = fuse.search(currentQuery, { limit: 15 }).map(result => result.item);
  } else {
    results = currentChannels;
  }

  return (
    <>
      <form ref={formRef} onSubmit={pickFirstEvent}>
        <div className="justify-center md:justify-start flex mb-5">
          {/* input */}
          <div className="flex-grow md:flex-initial md:w-4/12 lg:w-3/12 mr-1">
            <div className="relative rounded-md shadow-sm">
              <label className="hidden" htmlFor="searchStation">
                Filter Station
              </label>
              <input
                autoFocus={autoFocus}
                id="searchStation"
                className="form-input block w-full text-sm leading-5 py-2"
                placeholder="Filter Stations"
                aria-label="Filter Stations"
                defaultValue={currentQuery}
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
              type="button"
              aria-label="Clear"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-3 h-auto bg-white text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              onClick={resetAll}
            >
              <FontAwesomeIcon className="h-5 w-5" size="sm" icon="times" />
            </button>
          </div>
          <button type="submit" className="hidden" />
        </div>
      </form>

      {/* channels */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-4">
        {results.map(channel => (
          <div key={channel.id} className="text-cool-gray-500 hover:text-blue-800">
            <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
              <a>
                <div className="bg-cool-gray-900 hover:bg-cool-gray-700 rounded-lg p-3 md:p-5">
                  <Image
                    src={`/img/${channel.deeplink}-sm.png`}
                    loading="lazy"
                    alt={`${channel.name} Logo`}
                    quality={100}
                    width={138}
                    height={138}
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-center truncate text-sm md:text-lg leading-6 font-medium">
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
