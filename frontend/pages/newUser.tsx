import React from 'react';
import Link from 'next/link';
import { useObserver } from 'mobx-react';

import { useStores } from 'services/useStores';
import { SubscribeToggle } from 'components/SubscribeToggle';

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    loggedIn: user.loggedIn,
    setIsSubscribed: user.setIsSubscribed,
    isSubscribed: user.isSubscribed,
  }));
}

const NewUser = () => {
  const { setIsSubscribed, isSubscribed } = useUserData();
  return (
    <main className="max-w-lg mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 mt-10">
      <h3
        className="text-lg leading-6 font-medium text-gray-900 text-center my-5"
        id="renew-headline"
      >
        Thanks for Signing Up
      </h3>
      <SubscribeToggle isSubscribed={isSubscribed ?? false} onChange={setIsSubscribed} />

      <div className="mt-3">
        <span className="inline-flex rounded-md shadow-sm">
          <Link href="/profile">
            <a
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
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
