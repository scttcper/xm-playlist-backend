import React, { useState, useRef, Fragment } from 'react';
import { useClickAway } from 'react-use';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import { Genre, FriendlyGenre } from '../channels';

interface GenrePickerProps {
  pickGenre: (genre: Genre | null) => void;
  currentGenre: string | null;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export const GenrePicker: React.FC<GenrePickerProps> = ({ pickGenre, currentGenre }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const genres: Genre[] = [
    Genre.pop,
    Genre.rock,
    Genre.country,
    Genre.electronic,
    Genre.hiphop,
    Genre.rnb,
    Genre.jazz,
    Genre.reggae,
    Genre.classical,
    Genre.comedy,
    Genre.kids,
    Genre.christian,
    Genre.holiday,
    Genre.latino,
    Genre.french,
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
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              {currentGenre ? FriendlyGenre[currentGenre] : 'Genre'}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      )}
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
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
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
