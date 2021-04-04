import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsSubscribed, toggleSubscription } from 'services/userSlice';
import { SubscribeToggle } from 'components/SubscribeToggle';

const NewUser = () => {
  const isSubscribed = useSelector(selectIsSubscribed);
  const dispatch = useDispatch();

  return (
    <main className="max-w-lg mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 mt-10">
      <h3
        className="text-lg leading-6 font-medium text-gray-900 text-center my-5"
        id="renew-headline"
      >
        Welcome!
      </h3>
      <SubscribeToggle
        isSubscribed={isSubscribed}
        onChange={() => dispatch(toggleSubscription())}
      />

      <div className="mt-3 text-right">
        <span className="inline-flex rounded-md shadow-sm">
          <Link href="/profile">
            <a
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
            >
              Continue
            </a>
          </Link>
        </span>
      </div>
    </main>
  );
};

export default NewUser;
