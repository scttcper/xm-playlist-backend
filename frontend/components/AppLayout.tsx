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
import ReactGA from 'react-ga';

ReactGA.initialize('UA-84656736-2');

export class AppLayout extends React.Component<{ children: ReactNode; hasNav?: boolean }> {
  static defaultProps = {
    hasNav: true,
  };

  componentDidMount(): void {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render(): JSX.Element {
    return (
      <>
        <Head>
          <title>xmplaylist - recently played songs from xm radio</title>
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        </Head>
        {this.props.hasNav && (
          <nav className="navbar bg-dark">
            <div className="container">
              <div className="text-center text-md-left" style={{ width: '100%' }}>
                <Link prefetch href="/">
                  <a className="ml-md-3 navbar-brand text-white">
                    xmplaylist
                  </a>
                </Link>
              </div>
            </div>
          </nav>
        )}
        {this.props.children}
      </>
    );
  }
}

library.add(faSpotify, faApple, faEllipsisH, faInfoCircle, faMusic, faExternalLinkAlt, faArrowLeft);
