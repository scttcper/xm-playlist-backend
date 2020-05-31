import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';
import LazyLoad from 'react-lazyload';
import { useClickAway } from 'react-use';

import { TrackLinksButtons } from './TrackLinksButtons';

export const TrackLinks: React.FC<{
  links: Array<{ site: string; url: string }>;
  id: string;
}> = props => {
  const [show, setShow] = useState(false);
  const modalRef = useRef(null);
  useClickAway(modalRef, () => {
    if (show) {
      setShow(false);
    }
  });

  const handleShow = () => {
    ReactGA.event({
      category: 'Links',
      action: 'Opened Modal',
    });
    setShow(true);
  };

  return (
    <>
      <a
        className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
        onClick={handleShow}
      >
        <LazyLoad>
          <FontAwesomeIcon className="h-5 w-5" icon="music" className="text-dark mr-1" />
        </LazyLoad>{' '}
        Listen
      </a>

      {show && (
        <div className="fixed bottom-0 inset-x-0 px-3 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <div
            ref={modalRef}
            className="bg-white max-h-screen overflow-scroll md:overflow-hidden rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                aria-label="Close"
                onClick={() => setShow(false)}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="">
              <div className="mt-6 text-center sm:mt-5">
                <div className="mt-2">
                  <TrackLinksButtons links={props.links} id={props.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
