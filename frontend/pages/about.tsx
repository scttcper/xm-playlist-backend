import React from 'react';
import Image from 'next/image';

const About = () => (
  <div className="bg-white mx-auto my-3 pb-12 py-1 px-4 md:px-6 lg:px-8 rounded-lg prose pt-10">
    <div className="prose">
      <h1>About</h1>

      <p>
        Created by Scott (<a href="https://twitter.com/scttcper">@scttcper</a>) to discover new
        music heard on{' '}
        <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Sirius_XM">
          Sirius XM Satellite Radio
        </a>{' '}
        and organize them into spotify playlists.
      </p>

      <h3>Donate</h3>
      <figure>
        <a href="https://www.buymeacoffee.com/scooper" target="_blank" rel="noopener noreferrer">
          <Image
            unoptimized
            src="/img/default-orange.png"
            alt="Buy Me A Coffee"
            quality={100}
            width={356}
            height={100}
          />
        </a>
        <figcaption>Support future development by buying me a coffee.</figcaption>
      </figure>

      <h3>Contact</h3>
      <p>
        Email me at <a href="mailto:hello@xmplaylist.com">hello@xmplaylist.com</a> or on twitter{' '}
        <a href="https://twitter.com/scttcper">@scttcper</a>. Or join the nice people in the
        SiriusXM Fans{' '}
        <a
          href="https://www.facebook.com/groups/siriusxmfans"
          rel="noopener noreferrer"
          target="_blank"
        >
          Facebook group
        </a>
      </p>

      <hr />

      <h1 id="faq">FAQ</h1>

      <h4>Why has a station stopped updating?</h4>
      <p>
        xmplaylist cannot track songs during live dj sets, talk shows, interviews, festivals, etc.
        If it has been more than 3 days please <a href="mailto:hello@xmplaylist.com">email</a>.
      </p>

      <h4>Do you know what song played at [time] on Channel XYZ?</h4>
      <p>xmplaylist displays all the information I have.</p>

      <h4>Will I add a song to a playlist?</h4>
      <p>Sorry, the playlists are automatically controlled by what is played on Sirius XM.</p>
    </div>
  </div>
);

export default About;
