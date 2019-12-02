import React from 'react';
import '../index.scss';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faInfoCircle, faEllipsisH, faLink, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export const AppLayout: React.FC = props => {
  return (
    <>
      <Navbar expand bg="dark" variant="dark">
        <div className="text-center text-md-left" style={{ width: '100%' }}>
          <Link href="/"><a><Navbar.Brand>xmplaylist</Navbar.Brand></a></Link>
        </div>
      </Navbar>
      {props.children}
    </>
  );
};

library.add(faSpotify, faEllipsisH, faInfoCircle, faLink, faExternalLinkAlt);
