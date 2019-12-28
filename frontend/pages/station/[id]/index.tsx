import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceStrict } from 'date-fns';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { NextPageContext } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import React from 'react';
import AdSense from 'react-adsense';
import Link from 'next/link';

import { AppLayout } from '../../../components/AppLayout';
import { StationHeader } from '../../../components/StationHeader';
import { StationNavigation } from '../../../components/StationNavigation';
import { PlayJson } from '../../../../models';
import { channels } from '../../../channels';

interface StationProps {
  recent: PlayJson[][];
  channelId: string;
}

interface Context extends NextPageContext {
  id: string;
  recent: PlayJson[][];
  loading: false;
}

function getLastStartTime(recent: PlayJson[]): number {
  const last = recent[recent.length - 1].startTime;
  return new Date(last).getTime();
}

export default class Station extends React.Component<StationProps> {
  state = { recent: [], loading: false };

  static async getInitialProps(context: Context): Promise<StationProps> {
    const id = context.query.id as string;
    const res = await fetch(`http://localhost:3000/api/station/${id}`);
    const json = await res.json();
    return { recent: _.chunk(json, 12), channelId: id };
  }

  async fetchMore(): Promise<void> {
    this.setState({ loading: true });
    const playArr = this.state.recent.length ? this.state.recent : this.props.recent;
    const lastDateTime = getLastStartTime(playArr[playArr.length - 1]);
    const res = await fetch(
      `http://localhost:3000/api/station/${this.props.channelId}?last=${lastDateTime}`,
    );
    const json = await res.json();
    this.setState((state: Context) => {
      return { recent: [...state.recent, ..._.chunk(json, 12)], loading: false };
    });
  }

  render(): JSX.Element {
    const lowercaseId = this.props.channelId.toLowerCase();
    const channel = channels.find(
      channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId,
    );
    if (!channel) {
      return <Error statusCode={404} />;
    }

    const recent = [...this.props.recent, ...this.state.recent];

    return (
      <AppLayout>
        <Head>
          <title>{channel.name} Recently Played - sirius xm playlist</title>
        </Head>
        <div className="bg-light">
          <div className="container pt-2" style={{ paddingBottom: '2.5rem' }}>
            <div className="row">
              <div className="col-12 col-lg-6">
                <StationHeader channel={channel} />
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-1" style={{ marginTop: '-1.8rem' }}>
          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <a href={`https://open.spotify.com/user/xmplaylist/playlist/${channel.playlist}`}>
                <div className="bg-white text-dark shadow rounded p-3 d-flex justify-content-start">
                  <div className="">
                    <FontAwesomeIcon
                      className="mr-2"
                      style={{ color: '#000' }}
                      icon={['fab', 'spotify']}
                      size="lg"
                    />
                  </div>
                  <div className="mr-auto">{channel.name} playlist on Spotify</div>
                  <div>
                    <FontAwesomeIcon size="sm" icon="external-link-alt" />
                  </div>
                </div>
              </a>
            </div>
            <div className="col-12 col-md-6 mb-2">
              <a href={`https://open.spotify.com/user/xmplaylist/playlist/${channel.playlist}`}>
                <div className="bg-white text-dark shadow rounded p-3 d-flex justify-content-start">
                  <div className="">
                    <FontAwesomeIcon
                      className="mr-2"
                      style={{ color: '#000' }}
                      icon={['fab', 'apple']}
                      size="lg"
                    />
                  </div>
                  <div className="mr-auto">{channel.name} playlist on Apple Music</div>
                  <div>
                    <FontAwesomeIcon size="sm" icon="external-link-alt" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="container mb-1 adsbygoogle">
          <div className="row">
            <div className="col-12">
              <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
            </div>
          </div>
        </div>
        <div className="container mb-3">
          <div className="row">
            <div className="col-12">
              <StationNavigation channelId={channel.id} currentPage="recent" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {recent.map((chunk, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="col-12 adsbygoogle">
                      <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
                    </div>
                  )}
                  {chunk.map(play => {
                    const albumCover = play.track?.spotify?.cover || '/static/missing.png';
                    const timeAgo = formatDistanceStrict(new Date(play.startTime), new Date(), {
                      addSuffix: true,
                    });
                    return (
                      <React.Fragment key={play.id}>
                        <div className="col-4 col-lg-3 d-none d-md-block mb-3">
                          <div className="card h-100 shadow-sm border-0">
                            <img src={albumCover} className="card-img-top" alt="..." />
                            <div className="card-body d-flex align-items-start flex-column">
                              <div className="mb-auto pb-4" style={{ maxWidth: '100%' }}>
                                <small className="text-secondary">{timeAgo}</small>
                                <h5 className="mt-1 mb-0">{play.track.name}</h5>
                                <ul className="list-inline">
                                  {play.track.artists.map(artist => (
                                    <small key={artist.id} className="mr-2">
                                      {artist.name}
                                    </small>
                                  ))}
                                </ul>
                              </div>
                              <div className="d-flex flex-row" style={{ width: '100%' }}>
                                <div className="flex-fill mr-2">
                                  <Link href={`/station/${channel.deeplink.toLowerCase()}/track/${play.track.id}`}>
                                    <a className="btn btn-light btn-sm btn-block border">
                                      <FontAwesomeIcon
                                        icon="info-circle"
                                        className="text-dark mr-1"
                                      />{' '}
                                      Info
                                    </a>
                                  </Link>
                                </div>
                                {/* <div className="flex-fill mr-2">
                                <a className="btn btn-spotify btn-sm btn-block">
                                  <FontAwesomeIcon icon={['fab', 'spotify']} />
                                </a>
                              </div> */}
                                <div className="flex-fill">
                                  <a className="btn btn-light btn-sm btn-block border">
                                    <FontAwesomeIcon icon="music" className="text-dark mr-1" />{' '}
                                    Listen
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* mobile */}
                        <div className="col-12 d-md-none mb-3">
                          <div className="row bg-light shadow-light radius-media-left radius-media-right ml-0 mr-0">
                            <div className="col-5 p-0">
                              <img
                                src={albumCover}
                                className="img-fluid radius-media-left"
                                alt="..."
                              />
                            </div>
                            <div className="col-7 pt-2 pb-3 px-3">
                              <div
                                className="d-flex align-items-start flex-column"
                                style={{ height: '100%' }}
                              >
                                <div className="mb-auto" style={{ maxWidth: '100%' }}>
                                  <span className="text-secondary text-xs">5 Minutes ago</span>

                                  <h5 className="mt-0 mb-0 text-strong text-nowrap text-truncate">
                                    {play.track.name}
                                  </h5>
                                  <ul className="list-inline mb-0" style={{ lineHeight: 1 }}>
                                    {play.track.artists.map(artist => (
                                      <li
                                        key={artist.id}
                                        className="list-inline-item text-truncate"
                                      >
                                        <small>{artist.name}</small>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="d-flex flex-row" style={{ width: '100%' }}>
                                  <div className="flex-fill mr-2">
                                    <a className="btn btn-light btn-sm btn-block border">
                                      <FontAwesomeIcon icon="info-circle" /> Info
                                    </a>
                                  </div>
                                  {/* <div className="flex-fill mr-2">
                                <a className="btn btn-spotify btn-sm btn-block">
                                  <FontAwesomeIcon icon={['fab', 'spotify']} />
                                </a>
                              </div> */}
                                  <div className="flex-fill">
                                    <a className="btn btn-light btn-sm btn-block border">
                                      <FontAwesomeIcon icon="music" /> Links
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="container mb-4 text-center">
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn btn-lg btn-primary"
                onClick={async () => this.fetchMore()}
              >
                {this.state.loading ? 'Loading..' : 'Load More'}
              </button>
            </div>
          </div>
        </div>
        <div className="container adsbygoogle mb-5">
          <div className="row">
            <div className="col">
              <AdSense.Google client="ca-pub-7640562161899788" slot="7259870550" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
