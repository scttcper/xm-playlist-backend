import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { SearchIcon } from '@heroicons/react/solid';

import { selectUser } from 'services/userSlice';
import { channels } from 'frontend/channels';
import Link from 'next/link';
import { subDays, formatISO9075 } from 'date-fns';

export type Inputs = {
  artistName: string;
  station: string;
  trackName: string;
  timeAgo?: number | string;
  currentPage?: number;
  startDate?: string;
  endDate?: string;
};

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
  startDate,
  endDate,
}: Props) => {
  const hour = 60 * 60;
  const user = useSelector(selectUser);
  const { register, handleSubmit, control, setValue } = useForm<Inputs>({
    defaultValues: {
      artistName,
      timeAgo: startDate && endDate ? '' : timeAgo || hour * 24,
      station: station || '',
      trackName,
      startDate: startDate || '',
      endDate: endDate || '',
    },
  });
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
              type="text"
              {...register('trackName')}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              type="text"
              {...register('artistName', { minLength: 2 })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              render={({ field }) => (
                <Select
                  defaultValue={stationOptions.find(x => x.value === field.value)}
                  id="station"
                  instanceId="station"
                  options={stationOptions}
                  onBlur={field.onBlur}
                  onChange={(value: any) => field.onChange(value.value)}
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
            <div className="font-normal text-xs text-gray-500">
              Select either a date played or date range
            </div>
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <select
              {...register('timeAgo')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={() => {
                setValue('startDate', undefined);
                setValue('endDate', undefined);
              }}
            >
              <option value="">Date Range</option>
              <option value={hour}>last hour</option>
              <option value={hour * 12}>last 12 hours</option>
              <option value={hour * 24}>last 24 hours</option>
              <option value={hour * 24 * 7}>last 7 days</option>
              <option value={hour * 24 * 14}>last 14 days</option>
              <option value={hour * 24 * 30}>last 30 days</option>
              <option value={hour * 24 * 60}>last 60 days</option>
              {/* <option value={hour * 24 * 60}>
                last 60 days
              </option> */}
              {/* <option value={hour * 24 * 90}>last 90 days</option> */}
            </select>
          </div>
        </div>

        <div className="mt-6 mb-5 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
          <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
            Date Range (GMT -6:00)
            <div className="font-normal text-xs text-gray-500">Uses Central time</div>
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <label
              htmlFor="startDate"
              className="inline-block text-sm leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >
              Start Date
            </label>
            <input
              type="date"
              {...register('startDate', {
                min: formatISO9075(subDays(new Date(), 59), { representation: 'date' }),
                max: formatISO9075(new Date(), { representation: 'date' }),
              })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
              onChange={() => setValue('timeAgo', undefined)}
            />
            <label
              htmlFor="endDate"
              className="inline-block text-sm leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >
              End Date{' '}
            </label>
            <a
              className="text-blue-700 text-sm ml-1"
              onClick={() => {
                setValue('endDate', formatISO9075(new Date(), { representation: 'date' }));
                setValue('timeAgo', undefined);
              }}
            >
              (today)
            </a>
            <input
              type="date"
              {...register('endDate', {
                min: formatISO9075(subDays(new Date(), 59), { representation: 'date' }),
                max: formatISO9075(new Date(), { representation: 'date' }),
              })}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
              onChange={() => setValue('timeAgo', undefined)}
            />
          </div>
        </div>
      </div>

      <div className="sm:pt-5 text-right">
        <button
          type="submit"
          disabled={!user || isLoading}
          className={`inline-flex items-center px-6 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 ${
            user ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-300'
          }`}
        >
          {isLoading && 'Loading...'}
          {!isLoading && (
            <>
              <SearchIcon className="h-4 w-4 -ml-1 mr-2" aria-hidden="true" />
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
