import React from 'react';
import { useObserver } from 'mobx-react';
import { Adsense as GoogleAdsense } from '@ctrl/react-adsense';

import { useStores } from 'services/useStores';

function useIsPro() {
  const { user } = useStores();
  return useObserver(() => ({
    isPro: user.isPro,
  }));
}

export const Adsense = () => {
  const { isPro } = useIsPro();
  if (isPro) {
    return null;
  }

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
