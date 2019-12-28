import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceStrict } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { NextPageContext } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import AdSense from 'react-adsense';

import { AppLayout } from '../../../../../components/AppLayout';
import { StationHeader } from '../../../../../components/StationHeader';
import { StationNavigation } from '../../../../../components/StationNavigation';
import { PlayJson } from '../../../../../models';
import { channels } from '../../../../../src/channels';

interface StationProps {
  recent: PlayJson[][];
  channelId: string;
}

interface Context extends NextPageContext {
  id: string;
  recent: PlayJson[][];
  loading: false;
}

export default class Station extends React.Component<StationProps> {
  render(): JSX.Element {
    // const lowercaseId = this.props.channelId.toLowerCase();
    // const channel = channels.find(
    //   channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
    // );
    // if (!channel) {
    //   return <Error statusCode={404} />;
    // }

    return (
      <AppLayout>
        Hello
      </AppLayout>
    );
  }
}
