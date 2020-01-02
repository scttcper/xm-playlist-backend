import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/modal';

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

export function TrackLinks(props: { links: Array<{ site: string; url: string }> }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <a className="btn btn-light btn-sm btn-block border" onClick={handleShow}>
        <FontAwesomeIcon icon="music" className="text-dark mr-1" /> Listen
      </a>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Links</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    </>
  );
}
