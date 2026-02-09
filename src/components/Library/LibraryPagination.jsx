const LibraryPagination = ({ page, pageSize, totalItems, totalPages, onPageChange }) => {
  const startItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, totalItems);

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
    <div className="lx-library-pagination">
      <div className="lx-library-pagination-info">
        <span>
          Mostrando {startItem}–{endItem} di {totalItems} giochi
        </span>
      </div>

      <div className="lx-library-pagination-controls">
        <button className="lx-library-page-btn lx-library-page-btn--nav" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <i className="bi bi-chevron-left" />
          <span>Precedente</span>
        </button>

        <div className="lx-library-page-numbers">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              className={`lx-library-page-btn ${pageNum === page ? "lx-library-page-btn--active" : ""}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button className="lx-library-page-btn lx-library-page-btn--nav" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          <span>Successiva</span>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default LibraryPagination;
