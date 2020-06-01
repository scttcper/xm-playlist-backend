import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useClickAway } from 'react-use';
import { useObserver } from 'mobx-react';

import { useStores } from 'services/useStores';

function useUserData() {
  const { user } = useStores();
  return useObserver(() => ({
    user: user.user,
    logout: user.logout,
  }));
}

export const NavBar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useUserData();

  useClickAway(dropdownRef, () => {
    if (profileOpen) {
      setProfileOpen(false);
    }
  });

  const handleLogOut = () => {
    logout();
    router.push('/login');
    setProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center p-2 rounded-md text-cool-gray-400 hover:text-cool-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-cool-gray-500 transition duration-150 ease-in-out"
              aria-label="Main menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className={`h-6 w-6 ${mobileMenuOpen ? 'hidden' : 'block'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${mobileMenuOpen ? 'block' : 'hidden'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* menu */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center font-sans text-blue-900 hover:text-blue-600">
              <Link href="/">
                <a>xmplaylist</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              <Link href="/station">
                <a className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-cool-gray-500 hover:text-cool-gray-700 hover:border-gray-300 focus:outline-none focus:text-cool-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                  Stations
                </a>
              </Link>
              <Link href="/search">
                <a className="ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-cool-gray-500 hover:text-cool-gray-700 hover:border-gray-300 focus:outline-none focus:text-cool-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                  Search
                </a>
              </Link>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Link href="/search">
              <a
                className="sm:hidden p-1 border-2 border-transparent text-cool-gray-400 rounded-full hover:text-cool-gray-500 focus:outline-none focus:text-cool-gray-500 focus:bg-gray-100 transition duration-150 ease-in-out"
                aria-label="Notifications"
              >
                <FontAwesomeIcon icon="search" />
              </a>
            </Link>

            {/* <!-- Profile dropdown --> */}
            <div className="ml-3 relative">
              {user && (
                <div>
                  <button
                    type="button"
                    className="flex text-sm border border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                    id="user-menu"
                    aria-label="User menu"
                    aria-haspopup="true"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                      <svg
                        className="h-full w-full text-cool-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
              {user === null && (
                <div>
                  <Link href="/login">
                    <a className="flex text-sm rounded-full focus:outline-none transition duration-150 ease-in-out">
                      Log In
                    </a>
                  </Link>
                </div>
              )}
              <div
                ref={dropdownRef}
                className={`${
                  profileOpen ? '' : 'hidden'
                } origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg`}
              >
                <div
                  className="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link href="/profile">
                    <a
                      className="block px-4 py-2 text-sm leading-5 text-cool-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </a>
                  </Link>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm leading-5 text-cool-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    onClick={handleLogOut}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-4">
          <Link href="/station">
            <a className="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-cool-gray-600 hover:text-cool-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-cool-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
              Stations
            </a>
          </Link>
          <Link href="/search">
            <a className="mt-1 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-cool-gray-600 hover:text-cool-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-cool-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out">
              Search
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};
