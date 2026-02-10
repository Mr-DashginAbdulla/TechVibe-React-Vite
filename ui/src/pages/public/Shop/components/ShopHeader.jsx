import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid3X3, LayoutList } from "lucide-react";
import SortDropdown from "./SortDropdown";

const ShopHeader = ({
  searchQuery,
  totalResults,
  viewMode,
  setViewMode,
  sortValue,
  onSortChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card border-b border-border transition-colors">
      <div className="max-w-[1280px] mx-auto px-[16px] py-[24px]">
        <nav className="flex items-center gap-[8px] text-[14px] text-muted-foreground mb-[16px]">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{t("nav.shop")}</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-foreground">
              {searchQuery
                ? t("shop.searchResults").replace("{{query}}", searchQuery)
                : t("shop.title")}
            </h1>
            <p className="text-[14px] text-muted-foreground mt-[4px]">
              {t("shop.results").replace("{{count}}", totalResults.toString())}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-[12px]">
            <div className="flex items-center gap-[4px] p-[4px] bg-accent/50 rounded-[8px]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-[8px] rounded-[6px] transition-all ${
                  viewMode === "grid"
                    ? "bg-card shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-[8px] rounded-[6px] transition-all ${
                  viewMode === "list"
                    ? "bg-card shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="w-[18px] h-[18px]" />
              </button>
            </div>
            <SortDropdown value={sortValue} onChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
