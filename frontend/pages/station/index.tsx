import React from 'react';

import { Stations } from 'components/Stations';

const StationsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto pb-12 px-1 md:px-4 sm:px-6 lg:px-8">
    <div className="bg-white my-3 pb-12 py-4 lg:py-8 px-4 lg:px-8 sm:rounded-lg">
      <Stations />
    </div>
  </div>
);

export default StationsPage;
