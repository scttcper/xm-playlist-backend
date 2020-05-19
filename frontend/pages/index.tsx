import React from 'react';

import { Stations } from 'components/Stations';

export const Home: React.FC = () => {
  return (
    <>
      <div className="pt-6 pb-24 mx-auto px-4 sm:pt-12 sm:px-6 md:pt-10 bg-gray-800">
        <div className="text-center">
          <h2 className="text-4xl tracking-tight font-sans font-extrabold text-gray-200 sm:text-3xl sm:leading-none md:text-5xl">
            xmplaylist
          </h2>
          <p className="mt-3 mx-auto text-base text-gray-300 sm:text-lg md:mt-5 xl:text-xl">
            Recently played songs on XM Sirius radio
          </p>
        </div>
      </div>
      <main className="-mt-16">
        <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <Stations />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
