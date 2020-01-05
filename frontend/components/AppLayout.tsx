import '../index.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpotify, faApple } from '@fortawesome/free-brands-svg-icons';
import { faEllipsisH, faExternalLinkAlt, faInfoCircle, faMusic, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-000000-01');

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
        {this.props.children}
      </>
    );
  }
}

library.add(faSpotify, faApple, faEllipsisH, faInfoCircle, faMusic, faExternalLinkAlt, faArrowLeft);
