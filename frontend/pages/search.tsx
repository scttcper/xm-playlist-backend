import Head from 'next/head';
import React, { ChangeEvent, FormEvent } from 'react';
import fetch from 'isomorphic-unfetch';
import { format } from 'date-fns';

import { AppLayout } from '../components/AppLayout';
import { url } from '../url';

interface SearchProps {}
interface SearchState {
  artistName: string;
  results?: any[];
}

export default class MostHeard extends React.Component<SearchProps, SearchState> {
  state: SearchState = { artistName: 'orny', results: undefined };

  componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.search({ preventDefault: () => {} } as any);
  }

  search = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    searchParams.append('artistName', this.state.artistName);
    const res = await fetch(`${url}/search?${searchParams.toString()}`);
    const results = await res.json();
    this.setState({ results });
  };

  handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ artistName: event.target.value.trim() });
  };

  render(): JSX.Element {
    return (
      <AppLayout>
        <Head>
          <title>Search - xmplaylist.com recently played on xm radio</title>
        </Head>
        <div className="container mt-3">
          <div className="row mb-3">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                This feature is still under development.
              </div>
            </div>
            <div className="col-8 offset-2">
              <div className="bg-white rounded p-4">
                <h3 className="text-center">Search</h3>
                <form onSubmit={this.search}>
                  <div className="form-group">
                    <label htmlFor="artist">Artist Name (case insensitive)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="artist"
                      placeholder="Artist Name"
                      value={this.state.artistName}
                      onChange={this.handleArtistChange}
                    />
                  </div>
                  <div className="text-center">
                    <button className="btn btn-primary" type="submit">
                      Go
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="p-4">
                <h3>Results</h3>
                {this.state.results &&
                  this.state.results.map(result => {
                    const dateStr = format(new Date(result.startTime), 'MM/dd/yyyy KK:mm aaa');
                    return (
                      <div key={result.scrobbleId} className="row">
                        <div className="col-12 my-1 p-3 bg-white rounded">
                          <div className="d-flex flex-row">
                            <div className="p-2 bd-highlight">{dateStr}</div>
                          </div>
                          <div className="d-flex flex-row">
                            <div className="p-2 bd-highlight">Name: {result.name}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
