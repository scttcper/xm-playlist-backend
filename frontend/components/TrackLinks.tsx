import React, { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { XIcon } from '@heroicons/react/outline';
import { MusicNoteIcon } from '@heroicons/react/solid';

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
    setShow(true);
  };

  return (
    <>
      <a
        className="ml-1.5 inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
        onClick={handleShow}
      >
        <MusicNoteIcon className="h-3.5 w-3.5 -ml-0.5 mr-1" aria-hidden="true" />
        Listen
      </a>

      {show && (
        <div className="fixed bottom-5 inset-x-0 px-3 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <div
            ref={modalRef}
            className="bg-white max-h-screen md:overflow-hidden rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                onClick={() => setShow(false)}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 text-center sm:mt-5">
              <div className="mt-2">
                <TrackLinksButtons links={props.links} id={props.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
