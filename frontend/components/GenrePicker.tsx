import React, { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { Menu, Transition } from '@headlessui/react';

import { Genre, FriendlyGenre } from '../channels';

interface GenrePickerProps {
  pickGenre: (genre: Genre | null) => void;
  currentGenre: string | null;
}

export const GenrePicker: React.FC<GenrePickerProps> = ({ pickGenre, currentGenre }) => {
  const dropdownRef = useRef(null);
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
  const handlePickGenre = (event: any, genre: Genre | null) => {
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
    <Menu>
      {({ open }) => (
        <>
          <span className="rounded-md shadow-sm">
            <Menu.Button
              className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white leading-5 text-gray-600 hover:text-gray-900 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
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
            </Menu.Button>
          </span>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm bg-white w-full text-left leading-5 text-gray-900 hover:bg-blue-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      onClick={event => handlePickGenre(event, null)}
                    >
                      All
                    </a>
                  )}
                </Menu.Item>
                {genres.map(genre => (
                  <Menu.Item key={genre}>
                    {({ active }) => (
                      <a
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block px-4 py-2 text-sm bg-white w-full text-left leading-5 text-gray-900 hover:bg-blue-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                        onClick={event => handlePickGenre(event, genre)}
                      >
                        {FriendlyGenre[genre]}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
