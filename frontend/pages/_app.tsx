import Head from 'next/head';
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { Provider, useDispatch } from 'react-redux';

import { NavBar } from 'components/Navbar';
import { Footer } from 'components/Footer';
import { app, auth } from 'services/firebase';
import { store } from 'services/store';
import { onAuthStateChanged } from 'firebase/auth';

import '../css/tailwind.css';
import { login, extractUser, logout, fetchUserExtra } from 'services/userSlice';

const User: React.FC<any> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        dispatch(login(extractUser(firebaseUser)));
        dispatch(fetchUserExtra(firebaseUser));
      } else {
        dispatch(logout());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
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
    <Provider store={store}>
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
      <User />
      <div className="flex flex-col font-sans min-h-screen">
        <NavBar />
        <div className="flex-grow">
          <Component {...pageProps} err={err} />
        </div>
        <Footer />
      </div>
    </Provider>
  );
};

export default MyApp;
