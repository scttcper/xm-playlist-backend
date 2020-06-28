import React from 'react';
import { useObserver } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import { url } from '../url';
import { useStores } from 'services/useStores';
import { SubscribeToggle } from 'components/SubscribeToggle';

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    user: user.user,
    email: user.user?.email,
    logout: user.logout,
    loggedIn: user.loggedIn,
    setIsSubscribed: user.setIsSubscribed,
    isSubscribed: user.isSubscribed,
    isPro: user.isPro,
  }));
}

const Profile = () => {
  const { email, logout, loggedIn, setIsSubscribed, isSubscribed, isPro, user } = useUserData();
  const router = useRouter();

  if (loggedIn === false) {
    router.push('/login');
  }

  const handleLogOut = () => {
    logout();
    router.push('/login');
  };

  const handleManageClick = async () => {
    const token: string = (await user?.getIdToken()) || '';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const response = await axios.get(`${url}/api/manage/${user?.uid}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      timeout: 15 * 1000,
    });

    window.location.href = response.data.session.url;
  };

  return (
    <main className="max-w-lg mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 mt-4">
      <div className="bg-white shadow px-4 py-5 rounded-lg sm:p-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
          <p className="max-w-2xl text-sm leading-5 text-gray-500">User settings</p>
        </div>
        <div className="mt-5 border-t border-gray-200 pt-5">
          <dl>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-5 font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {email}
              </dd>
            </div>
            <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">Subscription</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                <span className="inline-flex mr-2 items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-gray-100 text-gray-800">
                  {isPro ? 'Pro Plan' : 'Free'}
                </span>
                {isPro === false && (
                  <Link href="/pricing">
                    <a className="text-blue-700 hover:underline">Upgrade</a>
                  </Link>
                )}
              </dd>
            </div>
            {/* <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {metadata && format(new Date(metadata?.creationTime as string), 'PPpp')}
              </dd>
            </div>
            <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">Last Login</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {metadata && format(new Date(metadata?.lastSignInTime as string), 'PPpp')}
              </dd>
            </div> */}
          </dl>
        </div>
      </div>
      {isPro === true && (
        <div className="bg-white shadow sm:rounded-lg my-2">
          <div className="px-4 py-5 p-6 flex items-center">
            <div className="flex-1">Manage Subscription</div>
            <div>
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                  onClick={handleManageClick}
                >
                  Manage
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
      <SubscribeToggle isSubscribed={isSubscribed ?? false} onChange={setIsSubscribed} />
      <div className="my-2">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md bg-white text-gray-500 hover:text-white hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
          onClick={handleLogOut}
        >
          <FontAwesomeIcon className="mr-2" icon="sign-out-alt" />
          Sign Out
        </button>
      </div>
    </main>
  );
};

export default Profile;
