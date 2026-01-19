const LibraryPagination = ({ page, pageSize, totalItems, totalPages, onPageChange }) => {
  const startItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, totalItems);

  // Calculate which page buttons to show (max 5)
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= maxButtons; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - maxButtons + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4">
      {/* Info Text */}
      <div className="text-center mb-3">
        <span className="lx-text-glow">
          Mostrando {startItem}–{endItem} di {totalItems} giochi
        </span>
      </div>

      {/* Pagination Buttons */}
      <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button className="btn lx-btn-outline" onClick={() => onPageChange(page - 1)} disabled={page === 1} style={{ minWidth: "120px" }}>
          <i className="bi bi-chevron-double-left me-2"></i>
          Precedente
        </button>

        {/* Page Numbers */}
        <div className="d-flex gap-2">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              className={pageNum === page ? "lx-btn-primary" : "lx-btn-outline"}
              onClick={() => onPageChange(pageNum)}
              style={{ minWidth: "45px" }}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button className="btn lx-btn-outline" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={{ minWidth: "120px" }}>
          Successiva
          <i className="bi bi-chevron-double-right ms-2"></i>
        </button>
      </div>
    </div>
  );
};

export default LibraryPagination;
