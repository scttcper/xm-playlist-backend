import Head from 'next/head';
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faApple, faSpotify } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faEllipsisH,
  faExternalLinkAlt,
  faInfoCircle,
  faMusic,
  faTimes,
  faSearch,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';

import { NavBar } from 'components/Navbar';
import { Footer } from 'components/Footer';

import '../css/tailwind.css';

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
);

ReactGA.initialize('UA-84656736-2');

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    setTimeout(() => ReactGA.pageview(window.location.pathname + window.location.search), 100);
  });

  return (
    <>
      <Head>
        <title>xmplaylist - Recently played songs from xm radio</title>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />

        <meta
          name="description"
          content="Find recently played songs from XM Sirius radio stations. Listen to them on Apple Music, Spotify, YouTube and others."
        />
        <meta name="keywords" content="xmplaylist,xm,playlist,siriusxm,sirius" />
      </Head>
      <div className="flex flex-col min-h-screen">
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
