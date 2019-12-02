/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import fetch from 'isomorphic-unfetch';
import { NextComponentType, NextPageContext } from 'next';
import Link from 'next/link';
import { channels } from '../src/channels';

import { AppLayout } from '../components/AppLayout';

const Movies: NextComponentType<NextPageContext, { movies: any[] }, { movies: any[] }> = props => {
  return (
    <AppLayout>
      Hello
      {channels.map(channel => (
        <div key={channel.id}>
          <Link href={`/station/${channel.id}`}>
            <a>{channel.id}</a>
          </Link>
        </div>
      ))}
    </AppLayout>
  );
};

export default Movies;
