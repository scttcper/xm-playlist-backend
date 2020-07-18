import React from 'react';

const About = () => (
  <div className="bg-white mx-auto my-3 pb-12 py-1 px-4 lg:px-8 rounded-lg prose pt-10">
    <div className="prose">
      <h1>About</h1>

      <p>
        Created by <a href="https://twitter.com/scttcper">@scttcper</a> to discover new songs being
        featured on{' '}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://en.wikipedia.org/wiki/XM_Satellite_Radio"
        >
          XM Satellite Radio
        </a>{' '}
        and organize them into spotify playlists.
      </p>

      <p>
        Contact us at <a href="mailto:hello@xmplaylist.com">hello@xmplaylist.com</a>
      </p>
    </div>
  </div>
);

export default About;
