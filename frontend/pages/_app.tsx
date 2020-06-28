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
import ReactGA from 'react-ga';

import { NavBar } from 'components/Navbar';
import { Footer } from 'components/Footer';
import { app } from 'services/firebase';
// enable mobx batching
import 'mobx-react-lite/batchingForReactDom';

import '../css/tailwind.css';
import { useStores } from 'services/useStores';

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

ReactGA.initialize('UA-84656736-2');

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { user } = useStores();
  useEffect(() => {
    setTimeout(() => ReactGA.pageview(window.location.pathname + window.location.search), 100);
  });

  useEffect(() => {
    app.auth().onAuthStateChanged(firebaseUser => {
      user.setUser(firebaseUser);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>xmplaylist - Recently played songs from xm radio</title>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-svg-core@1.2.28/styles.css" />

        <meta
          name="description"
          content="Find recently played songs from XM Sirius radio stations. Listen to them on Apple Music, Spotify, YouTube and others."
        />
        <meta name="keywords" content="xmplaylist,xm,playlist,siriusxm,sirius" />
      </Head>
      <div className="flex flex-col font-sans">
        <NavBar />
        <div className="flex-grow">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MyApp;
