import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';

import { AppLayout } from '../components/AppLayout';
import { channels } from '../src/channels';

export default class Movies extends React.Component<{ movies: any[] }, { movies: any[] }> {
  render(): JSX.Element {
    const genreSet = new Set<string>();
    channels.forEach(n => genreSet.add(n.genre));
    const genres = [...genreSet];

    return (
      <AppLayout hasNav={false}>
        <div className="container-fluid bg-dark text-white text-center">
          <div className="jumbotron p-4">
            <h1 className="display-2">xmplaylist</h1>
            <p className="mb-1">XM &amp; Sirius radio recently played</p>
            <p className="text-muted">
              By{' '}
              <a className="text-muted" href="https://twitter.com/scttcper">
                @scttcper
              </a>
            </p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
            </div>
          </div>
          <div className="row mt-3 mb-1">
            <div className="col-12 text-center">
              <h4>Stations</h4>
              {genres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  className="btn btn-light rounded-pill mr-1 mb-2 border"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4">
            {channels.map(channel => (
              <div key={channel.id} className="mb-3">
                <div className="col h-100">
                  <Link href={`/station/${channel.id}`}>
                    <a className="text-dark">
                      <div className="card h-100 shadow-light">
                        <img
                          src={`/static/img/${channel.id}.png`}
                          className="card-img-top p-3 bg-dark"
                          alt={`${channel.name} Logo`}
                        />
                        <div className="p-3 text-center">
                          <p className="mt-1 mb-0">{channel.name}</p>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
}
