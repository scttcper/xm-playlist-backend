import React, { useState } from 'react';
import { usePopper, Popper } from 'react-popper';
import { channels } from '../channels';

export const GenrePicker = () => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 10],
        },
      },
    ],
  });
  const [isOpen, setIsOpen] = useState(false);
  const genreSet = new Set<string>();
  channels.forEach(n => genreSet.add(n.genre));
  const genres = [...genreSet].sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div ref={setReferenceElement as any}>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            onClick={() => setIsOpen(!isOpen)}
          >
            Genre
            <svg className="-mr-1 ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      {/*
  <!--
    Dropdown panel, show/hide based on dropdown state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  --> */}

      <div
        ref={setPopperElement as any}
        className={`z-10 rounded-md shadow-lg ${isOpen ? 'flex' : 'hidden'}`}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="rounded-md bg-white shadow-xs">
          <div className="py-1">
            {genres.map(genre => (
              <a
                key={genre}
                href="#"
                className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
              >
                {genre}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
