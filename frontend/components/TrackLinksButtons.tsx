/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import ReactGA from 'react-ga';

const siteConversion = {
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
} as const;

type Props = {
  links: Array<{ site: string; url: string }>;
  id: string;
};

export const TrackLinksButtons = ({ links, id: trackId }: Props) => {
  const spotifyLink = links.find(link => link.site === 'spotify');
  const appleLink = links.find(link => link.site === 'itunes');
  const youtubeLink = links.find(link => link.site === 'youtube');

  links = links.filter(
    link => !['spotify', 'itunes', 'youtube', 'googleplayStore', 'itunesStore'].includes(link.site),
  );

  const trackOut = (site: string, id: string): void => {
    ReactGA.event({
      category: 'MusicClick',
      action: site,
      label: id,
    });
  };

  // Manually Sorted by most used links
  if (youtubeLink) {
    links.unshift(youtubeLink);
  }

  if (appleLink) {
    links.unshift(appleLink);
  }

  if (spotifyLink) {
    links.unshift(spotifyLink);
  }

  return (
    <div className="grid grid-cols-2 gap-3 text-center">
      {links.map(link => {
        return (
          <a
            key={link.site}
            style={{ fontWeight: 500 }}
            href={link.url}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOut(link.site, trackId)}
          >
            {siteConversion[link.site] || link.site}
          </a>
        );
      })}
    </div>
  );
};
