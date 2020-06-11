import React from 'react';
import Link from 'next/link';

export const Footer = () => (
  <div className="bg-white">
    <div className="max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
        <div className="px-5 py-2">
          <Link href="/about">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">About</a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <Link href="/tos">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">Terms</a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <Link href="/privacy">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">Privacy</a>
          </Link>
        </div>
      </nav>
      <div className="mt-8 max-w-xl mx-auto">
        <p className="text-center text-xs leading-6 text-gray-400 mb-2">
          &copy;2020 xmplaylist.com All rights reserved.
        </p>
        <p className="text-center text-xs leading-6 text-gray-400">
          Not affiliated, associated, authorized, endorsed by, or in any way officially connected
          with Sirius XM Radio Inc. The official SiriusXM website can be
          found at{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://www.siriusxm.com/">
            siriusxm.com
          </a>. The channel names, marks, emblems and images are registered trademarks of their respective owners.
        </p>
      </div>
    </div>
  </div>
);
