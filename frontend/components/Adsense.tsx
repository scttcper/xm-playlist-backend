import React from 'react';
import { Adsense as GoogleAdsense } from '@ctrl/react-adsense';

export const Adsense = () => {
  return (
    <div className="adsbygoogle block mt-3 mx-auto">
      <GoogleAdsense
        client="ca-pub-7640562161899788"
        slot="5645069928"
        style={{ display: 'block' }}
      />
    </div>
  );
};
