import React from 'react';
import App from 'next/app';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faApple, faSpotify } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faEllipsisH,
  faExternalLinkAlt,
  faInfoCircle,
  faMusic,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';

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
);

ReactGA.initialize('UA-84656736-2');

export default class GlobalApp extends App {
  componentDidMount(): void {
    setTimeout(() => ReactGA.pageview(window.location.pathname + window.location.search), 100);
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
