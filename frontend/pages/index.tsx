import React from 'react';

import { Stations } from 'components/Stations';

export const Home: React.FC = () => {
  return (
    <>
      <div className="pt-6 pb-24 mx-auto px-4 sm:pt-12 sm:px-6 md:pt-10 bg-cool-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-sans text-cool-gray-700 sm:leading-none md:text-4xl">
            xmplaylist
          </h2>
          <p className="mt-3 mx-auto text-base text-cool-gray-600 sm:text-lg md:mt-5 xl:text-xl">
            Recently played songs on XM Sirius radio
          </p>
        </div>
      </div>
      <main className="-mt-16">
        <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
          <div className="bg-white sm:rounded-lg shadow-2xl px-3 py-6 sm:px-6">
            <Stations />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
