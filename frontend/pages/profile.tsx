import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { logout, selectUser, selectIsSubscribed, toggleSubscription } from 'services/userSlice';
import { SubscribeToggle } from 'components/SubscribeToggle';
import { app } from 'services/firebase';

const Profile = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const isSubscribed = useSelector(selectIsSubscribed);
  const dispatch = useDispatch();

  if (typeof window !== 'undefined' && user === null) {
    router.push('/login');
  }

  const handleLogOut = async () => {
    await app.auth().signOut();
    dispatch(logout());
    router.push('/login');
  };

  return (
    <main className="min-h-screen max-w-lg mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 mt-4">
      <div className="bg-white shadow px-4 py-5 rounded-lg sm:p-6">
        <div>
          <h1 className="text-lg leading-6 font-medium text-gray-900">User Settings</h1>
        </div>
        <div className="mt-5 border-t border-gray-200 pt-5">
          <dl>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-5 font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <SubscribeToggle
        isSubscribed={isSubscribed}
        onChange={() => dispatch(toggleSubscription())}
      />
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
