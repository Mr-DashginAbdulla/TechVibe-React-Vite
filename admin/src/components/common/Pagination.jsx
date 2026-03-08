import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-[12px] px-[14px] py-[12px] border-t border-border bg-secondary ${className}`}
    >
      <p className="text-[12px] text-muted-foreground">
        {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems}
      </p>
      <div className="flex items-center gap-[3px]">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="p-[6px] rounded-[6px] hover:bg-accent disabled:opacity-40"
        >
          <ChevronsLeft className="w-[16px] h-[16px] text-foreground" />
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-[6px] rounded-[6px] hover:bg-accent disabled:opacity-40"
        >
          <ChevronLeft className="w-[16px] h-[16px] text-foreground" />
        </button>
        <div className="flex items-center gap-[3px] mx-[6px]">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-[32px] h-[32px] rounded-[6px] text-[13px] font-medium ${
                currentPage === p
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-[6px] rounded-[6px] hover:bg-accent disabled:opacity-40"
        >
          <ChevronRight className="w-[16px] h-[16px] text-foreground" />
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="p-[6px] rounded-[6px] hover:bg-accent disabled:opacity-40"
        >
          <ChevronsRight className="w-[16px] h-[16px] text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
