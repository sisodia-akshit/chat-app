import "../../Styles/Filters.css"
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className="pagination-button"
          style={{
            fontWeight: page === i + 1 ? "bold" : "normal",
            backgroundColor: page === i + 1 ? "var(--primary-color)" : "#ffffff",
            color: page === i + 1 ? "#fff" : "#000",
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
