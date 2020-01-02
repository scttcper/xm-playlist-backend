import '../index.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpotify, faApple } from '@fortawesome/free-brands-svg-icons';
import {
  faEllipsisH,
  faExternalLinkAlt,
  faInfoCircle,
  faMusic,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Navbar from 'react-bootstrap/Navbar';

export const AppLayout: React.FC<{ children: ReactNode; hasNav?: boolean }> = props => {
  return (
    <>
      <Head>
        <title>xmplaylist recently played songs from xm radio</title>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
      </Head>
      {props.hasNav && (
        <Navbar expand bg="dark" variant="dark">
          <div className="container">
            <div className="text-center text-md-left" style={{ width: '100%' }}>
              <Link prefetch href="/">
                <a className="ml-md-3">
                  <Navbar.Brand>xmplaylist</Navbar.Brand>
                </a>
              </Link>
            </div>
          </div>
        </Navbar>
      )}
      {props.children}
    </>
  );
};

AppLayout.defaultProps = {
  hasNav: true,
};

library.add(faSpotify, faApple, faEllipsisH, faInfoCircle, faMusic, faExternalLinkAlt, faArrowLeft);