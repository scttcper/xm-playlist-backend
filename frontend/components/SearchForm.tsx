import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useObserver } from 'mobx-react';
import Select from 'react-select';

import { useStores } from 'services/useStores';
import { channels } from 'frontend/channels';
import Link from 'next/link';

export type Inputs = {
  artistName: string;
  station: string;
  trackName: string;
  timeAgo: number;
  currentPage?: number;
};

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    user: user.user,
    isPro: user.isPro,
  }));
}

type Props = Inputs & {
  onSubmit: (data: Inputs) => Promise<void>;
  isLoading: boolean;
};

export const SearchForm = ({
  onSubmit,
  isLoading,
  artistName,
  timeAgo,
  station,
  trackName,
}: Props) => {
  const hour = 60 * 60;
  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: { artistName, timeAgo: timeAgo || hour * 24, station: station || '', trackName },
  });
  const { isPro, user } = useUserData();
  const stationOptions = channels.map(channel => {
    return { value: `${channel.deeplink}`, label: `${channel.name}` };
  });
  stationOptions.unshift({ value: '', label: 'All Channels' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-3 md:mt-0">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 md:pt-0.5">
          <label
            htmlFor="trackName"
            className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px"
          >
            <div>Track Title</div>
            <div className="font-normal text-xs text-gray-500">Case Insensitive</div>
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <input
              ref={register}
              name="trackName"
              id="trackName"
              className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <label
            htmlFor="artistName"
            className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px"
          >
            <div>Artist</div>
            <div className="font-normal text-xs text-gray-500">Case Insensitive</div>
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <input
              ref={register}
              name="artistName"
              id="artistName"
              minLength={2}
              className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <label
            htmlFor="station"
            className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Stations
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <Controller
              control={control}
              name="station"
              render={({ onChange, onBlur, value }) => (
                <Select
                  defaultValue={stationOptions.find(x => x.value === value)}
                  id="station"
                  instanceId="station"
                  options={stationOptions}
                  onBlur={onBlur}
                  onChange={(value: any) => onChange(value.value)}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-6 mb-5 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <label
            htmlFor="timeAgo"
            className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Date played
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <select
              ref={register}
              name="timeAgo"
              id="timeAgo"
              className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            >
              <option value={hour}>last hour</option>
              <option value={hour * 12}>last 12 hours</option>
              <option value={hour * 24}>last 24 hours</option>
              <option disabled={!isPro} value={hour * 24 * 7}>
                last 7 days (pro)
              </option>
              <option disabled={!isPro} value={hour * 24 * 14}>
                last 14 days (pro)
              </option>
              <option disabled={!isPro} value={hour * 24 * 30}>
                last 30 days (pro)
              </option>
              <option disabled={!isPro} value={hour * 24 * 60}>
                last 60 days (pro)
              </option>
              {/* <option disabled={!isPro} value={hour * 24 * 90}>last 90 days (pro)</option> */}
            </select>
          </div>
        </div>
      </div>

      <div className="sm:pt-5 text-right">
        <button
          type="submit"
          disabled={!user}
          className={`inline-flex items-center px-6 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 ${
            user ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-300'
          }`}
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
