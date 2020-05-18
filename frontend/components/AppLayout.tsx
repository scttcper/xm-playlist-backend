
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';

import { NavBar } from './Navbar';

export class AppLayout extends React.Component<{ children: ReactNode; hasNav?: boolean }> {
  static defaultProps = {
    hasNav: true,
  };

  render(): JSX.Element {
    return (
      <>
        <Head>
          <title>xmplaylist - recently played songs from xm radio</title>
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />

          <meta
            name="description"
            content="Recently played songs from XM Sirius radio stations like Hip Hop Nation, Octane, The Coffee House, and Pop2k. Listen to them on Apple Music, Spotify, YouTube and others."
          />
          <meta name="keywords" content="xmplaylist,xm,playlist,siriusxm,sirius" />
        </Head>
        <NavBar />
        {this.props.hasNav && (
          <nav className="navbar bg-dark">
            <div className="container text-white">
              <Link href="/">
                <a className="navbar-brand text-white">xmplaylist</a>
              </Link>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link href="/search">
                    <a className="text-white">Search</a>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        )}
        {this.props.children}
      </>
    );
  }
}
