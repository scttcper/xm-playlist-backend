import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AppLayout } from '../components/AppLayout';
import { channels, Channel } from '../channels';

export default class Movies extends React.Component<{ movies: any[] }> {
  state: { genreFilter: string; results: Channel[] } = { genreFilter: '', results: [] };
  fuse?: Fuse<Channel, { keys: Array<'name' | 'desc'> }>;

  filterGenre = (genre: string) => {
    if (this.state.genreFilter === genre) {
      this.setState({ genreFilter: '', results: [] });
    } else {
      this.setState({ genreFilter: genre, results: [] });
    }
  };

  handleBlur(): void {
    this.fuse = new Fuse(channels, {
      keys: [
        {
          name: 'name',
          weight: 0.9,
        },
        {
          name: 'desc',
          weight: 0.1,
        },
      ],
    });
  }

  handlePwdKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (!this.fuse) {
      this.handleBlur();
    }

    const query = (event.target as HTMLInputElement).value;
    this.setState({ results: this.fuse!.search(query), genreFilter: '' });
  }

  render(): JSX.Element {
    const genreSet = new Set<string>();
    channels.forEach(n => genreSet.add(n.genre));
    const genres = [...genreSet];

    let filteredChannels = channels;
    if (this.state.genreFilter) {
      filteredChannels = filteredChannels.filter(channel => channel.genre === this.state.genreFilter);
    }

    if (this.state.results.length) {
      filteredChannels = this.state.results;
    }

    return (
      <AppLayout hasNav={false}>
        <div className="container-fluid text-white text-center bg-dark pb-5 pt-2">
          <div className="row">
            <div className="col-12">
              <div className="jumbotron p-4 rounded">
                <h1 className="display-4">xmplaylist</h1>
                <p className="mb-1">Find recently played songs on XM Sirius radio</p>
                <p className="text-muted">
                  By{' '}
                  <a
                    className="text-muted"
                    href="https://twitter.com/scttcper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @scttcper
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="row adsbygoogle my-2">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          </div>
        </div>
        <div className="container bg-light text-center py-3 rounded-top shadow" style={{ marginTop: '-3em' }}>
          <div className="row mx-md-3">
            <div className="col-12 text-center">
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
              <input
                type="text"
                className="form-control mt-1 mx-auto"
                style={{ maxWidth: '600px' }}
                placeholder="Filter Stations"
                aria-label="Filter Stations"
                onKeyUp={event => this.handlePwdKeyUp(event)}
                onBlur={() => this.handleBlur()}
              />
            </div>
          </div>
        </div>
        <div className="container bg-light rounded-bottom mb-5">
          <div className="row mx-md-3 row-cols-2 row-cols-md-3 row-cols-lg-4 justify-content-center">
            {filteredChannels.map(channel => (
              <div key={channel.id} className="col mb-3">
                <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
                  <a className="text-dark">
                    <div className="card shadow-light h-100 border-0">
                      <div className="bg-dark p-3 card-img-top">
                        <LazyLoadImage
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
        </div>
        <div className="container mt-2 mb-5 adsbygoogle">
          <div className="row">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
