import { useState, useEffect } from "react";

interface PaginationProps<T> {
  items: T[]; // The array of items to paginate
  itemsPerPage: number; // Number of items to display per page
  onPageChange: (currentPageData: T[]) => void; // Function to pass current page data to the parent
}

const Pagination = <T,>({
  items,
  itemsPerPage,
  onPageChange,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = items.slice(startIndex, endIndex);
    onPageChange(currentPageItems);
  }, [currentPage, items]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
<div className="flex items-center justify-center mt-4 space-x-2">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-3 py-1 rounded-full transition-colors duration-200 ease-in-out ${
      currentPage === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-700 text-white"
    }`}
    aria-label="Previous Page"
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      onClick={() => handlePageChange(index + 1)}
      className={`px-3 py-1 rounded-full transition-colors duration-200 ease-in-out ${
        currentPage === index + 1
          ? "bg-indigo-600 text-white font-semibold"
          : "bg-gray-200 hover:bg-indigo-100 text-gray-700"
      }`}
      aria-label={`Page ${index + 1}`}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-3 py-1 rounded-full transition-colors duration-200 ease-in-out ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-700 text-white"
    }`}
    aria-label="Next Page"
  >
    Next
  </button>
</div>

  );
};

export default Pagination;
