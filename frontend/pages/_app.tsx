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
import * as Sentry from '@sentry/react';
import { RecoilRoot } from 'recoil';

import { NavBar } from 'components/Navbar';
import { Footer } from 'components/Footer';
import { app } from 'services/firebase';
import { useUser } from 'services/user';

import '../css/tailwind.css';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: 'https://beb4a51c9cad4585946d450b9b3005b9@o54215.ingest.sentry.io/5338805',
  ignoreErrors: [/google/gi, /Beacon/gi, /ads/],
});

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
    setTimeout(() => ReactGA.pageview(window.location.pathname + window.location.search), 100);
  });

  return (
    <RecoilRoot>
      <Head>
        <title>xmplaylist - Recently played songs and playlists from xm radio</title>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />

        <meta
          name="description"
          content="Find recently played songs from XM Sirius radio stations. Listen to them on Apple Music, Spotify, YouTube and others."
        />
        <meta name="keywords" content="xmplaylist,xm,playlist,siriusxm,sirius" />
      </Head>
      <User>
        <div className="flex flex-col font-sans">
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

export default Sentry.withProfiler(MyApp);
