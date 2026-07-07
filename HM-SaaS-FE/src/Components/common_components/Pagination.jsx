import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    let pages = [];
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center mt-3 space-x-2 items-center text-[12px]">
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded text-[12px] disabled:opacity-50 flex items-center cursor-pointer hover:bg-gray-100 transition"
        style={{ color: "var(--theme-primary-text)" }}
      >
        Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-[12px]"
            style={{ color: "var(--theme-primary-text)" }}
          >
            ...
          </span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => handlePageChange(page)}
            className="px-3 py-1 rounded cursor-pointer transition font-medium"
            style={
              currentPage === page
                ? {
                    background: "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    fontWeight: "700",
                  }
                : { color: "var(--theme-primary-text)" }
            }
            onMouseEnter={(e) => {
              if (currentPage !== page)
                e.currentTarget.style.background =
                  "var(--theme-secondary-card-bg)";
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page)
                e.currentTarget.style.background = "transparent";
            }}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded text-[12px] disabled:opacity-50 flex items-center cursor-pointer hover:bg-gray-100 transition"
        style={{ color: "var(--theme-primary-text)" }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
