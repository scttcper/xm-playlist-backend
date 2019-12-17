/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import fetch from 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import { channels } from '../../../src/channels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Error from 'next/error';
import { AppLayout } from '../../../components/AppLayout';
import Head from 'next/head';
import AdSense from 'react-adsense';
import { StationNavigation } from '../../../components/StationNavigation';
import PropTypes from 'prop-types';
import React from 'react';
import { PlayJson } from '../../../models';
import _ from 'lodash';
import { formatDistanceStrict } from 'date-fns';

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
    const channel = channels.find(channel => channel.deeplink.toLowerCase() === lowercaseId || channel.id === lowercaseId);
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
          <div className="container" style={{ paddingBottom: '2.5rem' }}>
            <div className="row">
              <div className="col-12 col-lg-6 p-2">
                <div className="media">
                  <img
                    style={{ maxWidth: '120px' }}
                    src={`/static/img/${channel.deeplink}-lg.png`}
                    className="img-fluid rounded-lg bg-dark mr-3 p-1"
                    alt="..."
                  />
                  <div className="media-body align-self-center">
                    <h3 className="mt-0 mb-1">{channel.name}</h3>
                    <small>{channel.desc}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-1" style={{ marginTop: '-2.3rem' }}>
          <div className="row">
            <div className="col-12 p-2">
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
                  <div className="mr-auto">Open {channel.name} on Spotify</div>
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
            <StationNavigation channelId={channel.id} currentPage="recent" />
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
                          <div className="card h-100">
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
                                  <a className="btn btn-light btn-sm btn-block border">
                                    <FontAwesomeIcon icon="info-circle" className="text-dark mr-1" /> Info
                                  </a>
                                </div>
                                {/* <div className="flex-fill mr-2">
                                <a className="btn btn-spotify btn-sm btn-block">
                                  <FontAwesomeIcon icon={['fab', 'spotify']} />
                                </a>
                              </div> */}
                                <div className="flex-fill">
                                  <a className="btn btn-light btn-sm btn-block border">
                                    <FontAwesomeIcon icon="link" className="text-dark mr-1" /> Listen
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* mobile */}
                        <div className="col-12 d-md-none mb-3">
                          <div className="row shadow-light radius-media-left radius-media-right ml-0 mr-0">
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
                                      <FontAwesomeIcon icon="link" /> Links
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
