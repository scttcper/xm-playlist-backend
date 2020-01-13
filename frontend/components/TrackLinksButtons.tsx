/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';

const siteConversion: Record<string, string> = {
  tidal: 'Tidal',
  spotify: 'Spotify',
  soundCloud: 'SoundCloud',
  itunes: 'Apple Music',
  itunesStore: 'iTunes',
  googleplay: 'Google Play',
  deezer: 'Deezer',
  napster: 'Napster',
  youtube: 'YouTube',
  pandora: 'Pandora',
  soundcloud: 'SoundCloud',
  amazon: 'Amazon',
  amazonMusic: 'Amazon Music',
  youtubeMusic: 'YouTube Music',
  googleplayStore: 'Google Play Store',
};

export function TrackLinksButtons(props: { links: Array<{ site: string; url: string }> }) {
  const spotifyLink = props.links.find(link => link.site === 'spotify');
  const appleLink = props.links.find(link => link.site === 'itunes');

  const links = props.links.filter(link => !['spotify', 'itunes'].includes(link.site));

  if (appleLink) {
    links.unshift(appleLink);
  }

  if (spotifyLink) {
    links.unshift(spotifyLink);
  }

  return (
    <>
      {links.map(link => (
        <a
          key={link.site}
          href={link.url}
          className="btn btn-block border rounded-pill"
          target="_blank"
          rel="noopener noreferrer"
        >
          {siteConversion[link.site] || link.site}
        </a>
      ))}
    </>
  );
}
