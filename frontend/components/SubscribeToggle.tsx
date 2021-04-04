import React from 'react';
import { Switch } from '@headlessui/react';

type Props = {
  isSubscribed: boolean;
  onChange: (subscribed: boolean) => void;
};

export const SubscribeToggle = ({ isSubscribed, onChange }: Props) => {
  return (
    <div className="bg-white shadow sm:rounded-lg my-2">
      <div className="px-4 py-5 p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900" id="subscribe-headline">
          Receive email updates
        </h3>
        <div className="mt-2 flex items-start justify-between">
          <div className="max-w-xl text-sm leading-5 text-gray-500">
            <p id="subscribe-description">Subscribe to news and updates about xmplaylist.com</p>
          </div>
          <div className="mt-0 ml-6 flex-shrink-0 flex items-center">
            <Switch
              checked={isSubscribed}
              className={`${
                isSubscribed ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onChange={() => onChange(!isSubscribed)}
            >
              <span className="sr-only">Enable email updates</span>
              <span
                className={`${
                  isSubscribed ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};
