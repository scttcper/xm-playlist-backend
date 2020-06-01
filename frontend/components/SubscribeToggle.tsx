import React from 'react';

type Props = {
  isSubscribed: boolean;
  onChange: (subscribed: boolean) => void;
};

export const SubscribeToggle = ({ isSubscribed, onChange }: Props) => {
  return (
    <div className="bg-white shadow sm:rounded-lg my-2">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900" id="subscribe-headline">
          Get Updates via Email
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm leading-5 text-gray-500">
            <p id="subscribe-description">
              Subscribe to news and updates about xmplaylist.com
            </p>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <span
              role="checkbox"
              tabIndex={0}
              aria-checked="false"
              aria-labelledby="subscribe-headline"
              aria-describedby="subscribe-description"
              className={`bg-gray-200 relative inline-block flex-no-shrink h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline ${
                isSubscribed ? 'bg-blue-600' : ''
              }`}
              onClick={() => onChange(!isSubscribed)}
            >
              <span
                aria-hidden="true"
                className={`translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${
                  isSubscribed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
