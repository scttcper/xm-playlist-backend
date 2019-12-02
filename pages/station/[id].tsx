/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import fetch from 'isomorphic-unfetch';
import { NextComponentType, NextPageContext } from 'next';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import { channels } from '../../src/channels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Error from 'next/error';

import { AppLayout } from '../../components/AppLayout';

const Station: NextComponentType<
  NextPageContext,
  { recent: any[] },
  { recent: any[]; channelId: string }
> = props => {
  const channel = channels.find(x => x.id === props.channelId);
  if (!channel) {
    return <Error statusCode={404} />;
  }

  return (
    <AppLayout>
      <div className="bg-light">
        <div className="container" style={{ paddingBottom: '2rem' }}>
          <div className="row">
            <div className="col-12 p-3">
              <div className="media">
                <img
                  src={`/static/img/${channel.id}.png`}
                  className="img-fluid rounded-lg bg-dark mr-3 p-2 col-3 col-lg-2"
                  alt="..."
                />
                <div className="media-body align-self-center">
                  <h3 className="mt-0">{channel.name}</h3>
                  <small>{channel.desc}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-2" style={{ marginTop: '-3rem' }}>
        <div className="row">
          <div className="col-12 p-3">
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
                <div className="mr-auto">
                  Open {channel.name} on Spotify
                </div>
                <div>
                  <FontAwesomeIcon size="sm" icon="external-link-alt" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="container mb-2">
        <div className="row">
          <div className="col-12">
            <h4>Recently Played</h4>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4">
          {props.recent.map(recent => {
            const albumCover = recent.track?.spotify?.cover || '/static/missing.png';
            return (
              <div key={recent.id}>
                <div className="col mb-3 d-none d-md-block">
                  <div className="card">
                    <img src={albumCover} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="mt-0 mb-0">{recent.track.name}</h5>
                      {recent.track.artists.map(artist => (
                        <small key={artist.id} className="mr-2">
                          {artist.name}
                        </small>
                      ))}
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
                {/* mobile */}
                <div className="col-12 d-md-none mb-3">
                  <div className="row shadow-light radius-media-left radius-media-right ml-0 mr-0">
                    <div className="col-5 p-0">
                      <img src={albumCover} className="img-fluid radius-media-left" alt="..." />
                    </div>
                    <div className="col-7 pt-2 pb-3 px-3">
                      <div
                        className="d-flex align-items-start flex-column"
                        style={{ height: '100%' }}
                      >
                        <div className="mb-auto" style={{ maxWidth: '100%' }}>
                          <span className="text-secondary text-xs">5 Minutes ago</span>

                          <h5 className="mt-1 mb-0 text-strong text-nowrap text-truncate">
                            {recent.track.name}
                          </h5>

                          {recent.track.artists.map(artist => (
                            <small key={artist.id} className="mr-2">
                              {artist.name}
                            </small>
                          ))}
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
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

Station.getInitialProps = async context => {
  const { id } = context.query;
  const res = await fetch(`http://localhost:3000/api/station/${id}`);
  const json = await res.json();
  console.log('recent', json);
  return { recent: json, channelId: id };
};

export default Station;
