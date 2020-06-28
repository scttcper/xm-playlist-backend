import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useObserver } from 'mobx-react';

import { url } from '../url';
import { useStores } from 'services/useStores';

const stripePromise = loadStripe(
  'pk_test_51GwEejLqOb5vGLHDjUG4ltmL318HNNmxFX7WDqBnJrVK8TKK5atnCyuIwzx6C1cmoKWwtEy3qkFVXmdvbJVf6xZd00fqlvohrk',
);

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    user: user.user,
    isPro: user.isPro,
  }));
}

const Pricing = () => {
  const { user, isPro } = useUserData();

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

  const handleClick = async () => {
    const token: string = (await user?.getIdToken()) || '';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const response = await axios.get(`${url}/api/getpro/${user?.uid}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      timeout: 15 * 1000,
    });
    const stripe = await stripePromise;
    if (stripe === null) {
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  };

  return (
    <div className="bg-gray-100">
      <div className="pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10 lg:text-5xl lg:leading-none">
              Pricing
            </h2>
            {/* <p className="mt-4 text-xl leading-7 text-gray-600"></p> */}
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-100" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
              <div className="bg-white px-6 py-8 lg:flex-grow lg:p-12">
                <h3 className="text-2xl leading-8 font-extrabold text-gray-900 sm:text-3xl sm:leading-9">
                  Pro Plan
                </h3>
                <p className="mt-6 text-base leading-6 text-gray-500">
                  Upgrade your account to access more features and browse ad-free.
                </p>
                <div className="mt-8">
                  <div className="flex items-center">
                    <h4 className="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-blue-600">
                      What's included
                    </h4>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>
                  <ul className="mt-8 lg:grid lg:grid-cols-2 lg:col-gap-8 lg:row-gap-5">
                    <li className="flex items-start lg:col-span-1">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm leading-5 text-gray-700">Ad-Free browsing</p>
                    </li>
                    <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm leading-5 text-gray-700">
                        Support future site development
                      </p>
                    </li>
                    <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm leading-5 text-gray-700">
                        Advanced search features
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                <p className="text-lg leading-6 font-medium text-gray-900">Monthly</p>
                <div className="mt-4 flex items-center justify-center text-5xl leading-none font-extrabold text-gray-900">
                  <span>$5</span>
                  <span className="ml-3 text-xl leading-7 font-medium text-gray-500">USD</span>
                </div>
                <div className="mt-6">
                  <div className="rounded-md shadow">
                    {isPro === false && (
                      <button
                        type="button"
                        className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        onClick={handleClick}
                      >
                        Upgrade to Pro Plan
                      </button>
                    )}
                    {isPro === true && (
                      <button
                        type="button"
                        className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        onClick={handleManageClick}
                      >
                        Manage Pro Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
