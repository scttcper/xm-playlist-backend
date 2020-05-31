import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase';

import { channels } from 'frontend/channels';
import Link from 'next/link';

export type Inputs = {
  artistName: string;
  station: string;
  trackName: string;
  user: User | null;
};

type Props = Inputs & {
  onSubmit: (data: Inputs) => Promise<void>;
  isLoading: boolean;
};

export const SearchForm = ({ onSubmit, isLoading, artistName, user }: Props) => {
  const { register, handleSubmit } = useForm<Inputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 sm:col-span-2">
          <label htmlFor="trackName" className="block text-sm font-medium leading-5 text-gray-700">
            Track Title
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              ref={register}
              name="trackName"
              id="trackName"
              className="form-input block w-full sm:text-sm sm:leading-5"
              placeholder=""
              minLength={2}
            />
          </div>
        </div>
        <div className="col-span-3 sm:col-span-2">
          <label htmlFor="artistName" className="block text-sm font-medium leading-5 text-gray-700">
            Artist Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              ref={register}
              defaultValue={artistName}
              name="artistName"
              id="artistName"
              className="form-input block w-full sm:text-sm sm:leading-5"
              placeholder=""
              minLength={2}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-3 sm:col-span-2">
          <label htmlFor="station" className="block text-sm leading-5 font-medium text-gray-700">
            Station
          </label>
          <select
            ref={register}
            name="station"
            id="station"
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-400"
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

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-3 sm:col-span-2">
          <label htmlFor="station" className="block text-sm leading-5 font-medium text-gray-700">
            In the last (coming soon)
          </label>
          <select
            disabled
            name="station"
            id="station"
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-400"
          >
            <option value="">24 hours</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!user}
        className={`inline-flex items-center px-3 py-2 mt-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 ${user ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-300'}`}
      >
        {isLoading && (
          <>
            <FontAwesomeIcon spin className="mr-2 h-5 w-5" icon="spinner" /> Loading...
          </>
        )}
        {!isLoading && (
          <>
            <FontAwesomeIcon className="mr-2 h-5 w-5" icon="search" />
            Search
          </>
        )}
      </button>

      {!user && (
        <p className="mt-5">
          Please{' '}
          <Link href="/login">
            <a className="text-blue-600">log in</a>
          </Link>{' '}
          to use search
        </p>
      )}
    </form>
  );
};
