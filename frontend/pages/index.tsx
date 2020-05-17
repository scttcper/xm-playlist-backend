import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AppLayout } from '../components/AppLayout';
import { channels, Channel } from '../channels';
import { GenrePicker } from 'components/GenrePicker';

export default class Home extends React.Component {
  state: { genreFilter: string; results: Channel[]; genreMenuOpen: boolean } = {
    genreFilter: '',
    results: [],
    genreMenuOpen: false,
  };

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const results = this.fuse!.search(query).map(result => result.item);
    this.setState({ results, genreFilter: '' });
  }

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

    if (this.state.results.length) {
      filteredChannels = this.state.results;
    }

    return (
      <AppLayout hasNav={false}>
        <div className="pt-10 pb-32 mx-auto px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 bg-gray-800">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-sans font-extrabold text-gray-200 sm:text-3xl sm:leading-none md:text-5xl">
              xmplaylist
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Recently played songs on XM Sirius radio
            </p>
            <p className="mt-3 text-base text-gray-300">
              Created by{' '}
              <a
                className="font-medium hover:text-indigo-600"
                href="https://twitter.com/scttcper"
                target="_blank"
                rel="noopener noreferrer"
              >
                @scttcper
              </a>
            </p>
            <AdSense.Google client="ca-pub-7640562161899788" slot="5645069928" />
          </div>
        </div>
        <main className="-mt-16">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">

              {/* filters */}
              <div className="justify-center flex mb-5">
                {/* input */}
                <div className="flex-initial max-w-sm mx-1">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="text"
                      className="form-input block w-full text-sm leading-5 py-2"
                      placeholder="Filter Stations"
                      onKeyUp={event => this.handlePwdKeyUp(event)}
                      onBlur={() => this.handleBlur()}
                    />
                  </div>
                </div>
                {/* dropdown */}
                <div className="flex-initial">
                  <GenrePicker />
                </div>
              </div>

              {/* channels */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredChannels.map(channel => (
                  <div key={channel.id} className="text-gray-800 hover:text-indigo-800">
                    <Link href="/station/[id]" as={`/station/${channel.deeplink.toLowerCase()}`}>
                      <a className="">
                        <div>
                          <div className="transition duration-500 ease-in-out bg-gray-900 hover:bg-gray-700 transform rounded-lg p-5">
                            <LazyLoadImage
                              src={`/static/img/${channel.deeplink}-lg.png`}
                              className="card-img-top"
                              alt={`${channel.name} Logo`}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-center text-lg leading-6 font-medium">
                            {channel.name}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <div className="container-fluid text-white text-center bg-dark pb-5 pt-2">
          <div className="row">
            <div className="col-12">
              <div className="jumbotron p-4 rounded">
                <h1 className="display-4">xmplaylist</h1>
                <p className="mb-1">Recently played songs on XM Sirius radio</p>
                <p className="text-muted">
                  Created by{' '}
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
      </AppLayout>
    );
  }
}
