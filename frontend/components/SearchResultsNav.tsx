/* eslint-disable no-mixed-operators */
import React from 'react';
import { SearchResults } from 'pages/search';

type Props = {
  searchResults: Partial<SearchResults>;
  nextPage: () => void;
  previousPage: () => void;
};

export const SearchResultsNav = ({ searchResults, nextPage, previousPage }: Props) => {
  const currentPage = searchResults.currentPage || 1;
  const hasPrevious = currentPage > 1;
  const totalPages = searchResults.pages || 1;
  const hasNext = currentPage < totalPages;
  const offsetStart = Math.min(
    currentPage * 100 - searchResults.results!.length + 1,
    (searchResults.totalItems || 0) - searchResults.results!.length + 1,
  );

  return (
    <nav className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sm:px-6">
      <div className="hidden sm:block">
        <p className="text-sm leading-5 text-gray-700">
          Showing <span className="font-medium">{offsetStart}</span> to{' '}
          <span className="font-medium">
            {/* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */}
            {offsetStart + searchResults.results!.length - 1}
          </span>{' '}
          of <span className="font-medium">{searchResults.totalItems}</span> results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          type="button"
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 ${
            hasPrevious ? 'hover:text-gray-500 text-gray-700' : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!hasPrevious}
          onClick={() => previousPage()}
        >
          Previous
        </button>
        <button
          type="button"
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 ${
            hasNext ? 'hover:text-gray-500 text-gray-700' : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!hasNext}
          onClick={() => nextPage()}
        >
          Next
        </button>
      </div>
    </nav>
  );
};
