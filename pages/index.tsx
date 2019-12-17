import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';

import { AppLayout } from '../components/AppLayout';
import { channels } from '../src/channels';

export default class Movies extends React.Component<{ movies: any[] }, { genreFilter: string }> {
  state = { genreFilter: '' };

  filterGenre = (genre: string) => {
    if (this.state.genreFilter === genre) {
      this.setState({ genreFilter: '' });
    } else {
      this.setState({ genreFilter: genre });
    }
  };

  render(): JSX.Element {
    const genreSet = new Set<string>();
    channels.forEach(n => genreSet.add(n.genre));
    const genres = [...genreSet];

    let filteredChannels = channels;
    if (this.state.genreFilter) {
      filteredChannels = filteredChannels.filter(
        channel => channel.genre === this.state.genreFilter,
      );
    }

    return (
      <AppLayout hasNav={false}>
        <div className="container-fluid text-white text-center bg-dark pb-5">
          <div className="row">
            <div className="col-12">
              <div className="jumbotron p-4 rounded">
                <h1 className="display-4">xmplaylist</h1>
                <p className="mb-1">XM &amp; Sirius radio recently played</p>
                <p className="text-muted">
                  By{' '}
                  <a className="text-muted" href="https://twitter.com/scttcper">
                    @scttcper
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container adsbygoogle">
          <div className="row">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
            </div>
          </div>
        </div>
        <div className="container bg-light text-center pt-3 rounded-top shadow" style={{ marginTop: '-3em' }}>
          <div className="row mx-md-3">
            <div className="col-12">
              <h4>Stations</h4>
              {genres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  className={
                    'btn rounded-pill mr-1 mb-2 border ' +
                    (this.state.genreFilter === genre ? 'btn-primary' : 'btn-light')
                  }
                  onClick={() => this.filterGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="container bg-light rounded-bottom mb-5">
          <div className="row mx-md-3 row-cols-2 row-cols-md-3 row-cols-lg-4 justify-content-center">
            {filteredChannels.map(channel => (
              <div key={channel.id} className="col mb-3">
                <Link href={`/station/${channel.deeplink.toLowerCase()}`}>
                  <a className="text-dark">
                    <div className="card shadow-light h-100">
                      <div className="bg-dark p-3 card-img-top">
                        <img
                          src={`/static/img/${channel.deeplink}-lg.png`}
                          className="card-img-top"
                          alt={`${channel.name} Logo`}
                        />
                      </div>
                      <div className="p-3 text-center">
                        <p className="mt-1 mb-0">{channel.name}</p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
          <div className="row bg-light adsbygoogle">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
