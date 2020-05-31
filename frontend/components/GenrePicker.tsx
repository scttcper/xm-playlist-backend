import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';

import { Genre, FriendlyGenre } from '../channels';

interface GenrePickerProps {
  pickGenre: (genre: Genre) => void;
  currentGenre: string | null;
}

export const GenrePicker: React.FC<GenrePickerProps> = ({ pickGenre, currentGenre }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const dropdownRef = useRef(null);
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
  const genres: Genre[] = [
    Genre.rock,
    Genre.pop,
    Genre.electronic,
    Genre.hiphop,
    Genre.rnb,
    Genre.jazz,
    Genre.country,
    Genre.classical,
    Genre.latino,
    Genre.comedy,
    Genre.kids,
    Genre.christian,
  ];
  const handlePickGenre = (event: React.MouseEvent<HTMLAnchorElement>, genre: Genre) => {
    event.preventDefault();
    setIsOpen(false);
    pickGenre(genre);
  };

  useClickAway(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <div ref={dropdownRef}>
      <div ref={setReferenceElement as any}>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white leading-5 font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {currentGenre ? FriendlyGenre[currentGenre] : 'Genre'}
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

      <div
        ref={setPopperElement as any}
        className={`z-10 rounded-md shadow-lg ${isOpen ? '' : 'hidden'}`}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="rounded-md bg-white">
          <div className="py-1">
            {genres.map(genre => (
              <a
                key={genre}
                type="button"
                className="block px-4 py-2 text-sm leading-5 text-gray-900 hover:bg-blue-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                onClick={event => handlePickGenre(event, genre)}
              >
                {FriendlyGenre[genre]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
