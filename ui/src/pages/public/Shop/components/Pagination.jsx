import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-[8px] mt-[40px]">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-border bg-card text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-[16px] h-[16px]" />
        <span className="text-[14px] font-medium hidden sm:inline">
          {t("shop.previousPage")}
        </span>
      </button>

      <div className="flex items-center gap-[4px]">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-[36px] h-[36px] rounded-[8px] text-[14px] font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-accent"
                }`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="text-muted-foreground px-[4px]">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-border bg-card text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-[14px] font-medium hidden sm:inline">
          {t("shop.nextPage")}
        </span>
        <ChevronRight className="w-[16px] h-[16px]" />
      </button>
    </div>
  );
};

export default Pagination;
