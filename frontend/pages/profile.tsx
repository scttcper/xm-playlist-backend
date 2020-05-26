import React from 'react';
import { useObserver } from 'mobx-react';

import { useStores } from 'services/useStores';

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    email: user.user?.email,
    metadata: user.user?.metadata,
  }));
}

const Profile = () => {
  const { email, metadata } = useUserData();
  return (
    <main className="max-w-7xl mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 my-2 md:mt-3">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
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
              <dt className="text-sm leading-5 font-medium text-gray-500">User Level</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                Free
              </dd>
            </div>
            <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {metadata?.creationTime}
              </dd>
            </div>
            <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">Last Login</dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {metadata?.lastSignInTime}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default Profile;
