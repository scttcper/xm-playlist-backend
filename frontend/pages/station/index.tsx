import React from 'react';

import { Stations } from 'components/Stations';
import { Adsense } from 'components/Adsense';
import { NeworAd } from 'components/Newor';

const StationsPage: React.FC = () => (
  <>
    <div className="max-w-7xl mx-auto pb-3 px-1 md:px-4 sm:px-6 lg:px-8">
      <NeworAd id="waldo-tag-9958" style={{ maxWidth: '970px', display: 'inline-block' }} />
    </div>
    <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
      <div className="bg-white my-3 pb-12 py-4 lg:py-8 px-4 lg:px-8 sm:rounded-lg">
        <Stations autoFocus />
      </div>
    </div>
    <div className="max-w-7xl mx-auto pb-3 px-1 md:px-4 sm:px-6 lg:px-8 adsbygoogle">
      <Adsense />
    </div>
  </>
);

export default StationsPage;
