import React from 'react';

const Pagination = ({ placesPerPage, totalPlaces, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPlaces / placesPerPage); i++) {
    pageNumbers.push(i);
  }

  const getPageNumbers = () => {
    const totalPages = pageNumbers.length;
    const pagesToShow = [];

    if (totalPages <= 7) {
      return pageNumbers;
    }

    pagesToShow.push(1);

    if (currentPage > 4) {
      pagesToShow.push('...');
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      pagesToShow.push(i);
    }

    if (currentPage < totalPages - 3) {
      pagesToShow.push('...');
    }

    if (!pagesToShow.includes(totalPages)) {
      pagesToShow.push(totalPages);
    }

    return pagesToShow;
  };

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex flex-wrap justify-center items-center space-x-2">
        <li>
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            className="px-2 py-1 border rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        {getPageNumbers().map((number, index) => (
          <li key={index}>
            {number === '...' ? (
              <span className="px-2 py-1">...</span>
            ) : (
              <button
                onClick={() => paginate(number)}
                className={`px-2 py-1 border rounded ${
                  currentPage === number
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-primary hover:text-white'
                } transition-colors`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() =>
              paginate(Math.min(pageNumbers.length, currentPage + 1))
            }
            className="px-2 py-1 border rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors"
            disabled={currentPage === pageNumbers.length}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;