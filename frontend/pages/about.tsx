import React from 'react';

const Tos = () => (
  <div className="bg-white max-w-lg mx-auto my-3 pb-12 py-1 px-4 sm:px-6 lg:px-7">
    <div className="my-10">
      <h1 className="text-4xl font-bold leading-7 text-gray-900">About</h1>
    </div>

    <p className="my-4">
      xmplaylist.com was created by{' '}
      <a className="text-indigo-600" href="https://twitter.com/scttcper">
        @scttcper
      </a>{' '}
      to automatically discover new songs being played on xm radio and automatically create spotify
      playlists. Spotify has very good music discovery, but xm radio is another source of excellent
      music curation.
    </p>
  </div>
);

export default Tos;
