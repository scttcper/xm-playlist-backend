import Head from 'next/head';
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faApple, faSpotify, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faEllipsisH,
  faExternalLinkAlt,
  faInfoCircle,
  faMusic,
  faTimes,
  faSearch,
  faSpinner,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { RecoilRoot } from 'recoil';

import { NavBar } from 'components/Navbar';
import { Footer } from 'components/Footer';
import { app } from 'services/firebase';
import { useUser } from 'services/user';

import '../css/tailwind.css';

config.autoAddCss = false;
library.add(
  faSpotify,
  faApple,
  faEllipsisH,
  faInfoCircle,
  faMusic,
  faExternalLinkAlt,
  faArrowLeft,
  faTimes,
  faSearch,
  faSpinner,
  faGoogle,
  faTwitter,
  faSignOutAlt,
);

const User: React.FC<any> = ({ children }) => {
  const { setUser } = useUser();
  useEffect(() => {
    app.auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

// not sure if err exists?
// @ts-expect-error
const MyApp: React.FC<AppProps> = ({ Component, pageProps, err }) => {
  useEffect(() => {
    if (typeof window === 'object') {
      // @ts-expect-error
      window.dataLayer = window.dataLayer || [];

      // eslint-disable-next-line func-names
      window.gtag = function gtag() {
        // @ts-expect-error
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };

      gtag('js', new Date());
      gtag('config', 'G-3CYFENTWD4', { debug: true });
    }
  });

  return (
    <RecoilRoot>
      <Head>
        <title>xmplaylist - Recently played songs and playlists from xm radio</title>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3CYFENTWD4" />

        <meta
          name="description"
          content="Find recently played songs from XM Sirius radio stations. Listen to them on Apple Music, Spotify, YouTube and others."
        />
        <meta name="keywords" content="xmplaylist,xm,playlist,siriusxm,sirius" />
      </Head>
      <User>
        <div className="flex flex-col font-sans min-h-screen">
          <NavBar />
          <div className="flex-grow">
            <Component {...pageProps} err={err} />
          </div>
          <Footer />
        </div>
      </User>
    </RecoilRoot>
  );
};

export default MyApp;
