import React from 'react';

const Tos = () => (
  <div className="bg-white max-w-lg mx-auto my-3 pb-12 py-1 px-4 sm:px-6 lg:px-7 rounded">
    <div className="my-10">
      <h1 className="text-4xl font-bold leading-7 text-gray-900">About</h1>
    </div>

    <p className="my-4">
      Created by{' '}
      <a className="text-blue-600" href="https://twitter.com/scttcper">
        @scttcper
      </a>{' '}
      to automatically discover new songs being played on xm radio and organize those songs into
      spotify playlists.
    </p>

    <p className="my-4">
      Contact us at{' '}
      <a className="text-blue-600" href="mailto:hello@xmplaylist.com">
        hello@xmplaylist.com
      </a>
    </p>
  </div>
);

export default Tos;
