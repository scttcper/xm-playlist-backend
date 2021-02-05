import React from 'react';

import { Stations } from 'components/Stations';
import { Adsense } from 'components/Adsense';
import { NeworAd } from 'components/Newor';

export const Home: React.FC = () => {
  return (
    <>
      <div className="pt-6 pb-24 mx-auto px-4 sm:pt-12 sm:px-6 md:pt-10 bg-gradient-to-b from-white to-gray-200">
        <div className="text-center">
          <h2 className="text-4xl font-sans text-cool-gray-700 sm:leading-none md:text-4xl">
            xmplaylist
          </h2>
          <p className="mt-3 mx-auto text-base text-cool-gray-600 sm:text-lg md:mt-5 xl:text-xl">
            Recently played songs on XM Sirius radio
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pb-3 px-1 md:px-4 sm:px-6 lg:px-8">
        <NeworAd id="waldo-tag-9958" style={{ maxWidth: '970px' }} />
      </div>
      <main>
        <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-2xl px-3 py-6 sm:px-6">
            <Stations autoFocus={false} />
          </div>
        </div>
      </main>
      <div className="max-w-7xl mx-auto pb-3 px-1 md:px-4 sm:px-6 lg:px-8 adsbygoogle">
        <Adsense />
      </div>
    </>
  );
};

export default Home;
