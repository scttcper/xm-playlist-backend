import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/modal';
import { TrackLinksButtons } from './TrackLinksButtons';

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
          <TrackLinksButtons links={props.links} />
        </Modal.Body>
      </Modal>
    </>
  );
}
