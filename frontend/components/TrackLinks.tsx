import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import ReactGA from 'react-ga';

import { TrackLinksButtons } from './TrackLinksButtons';

export const TrackLinks: React.FC<{
  links: Array<{ site: string; url: string }>;
  id: string;
}> = props => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    ReactGA.event({
      category: 'Links',
      action: 'Opened Modal',
    });
    setShow(true);
  };

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
          <TrackLinksButtons links={props.links} id={props.id} />
        </Modal.Body>
      </Modal>
    </>
  );
};
