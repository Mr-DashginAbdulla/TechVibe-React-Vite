import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const FilterSidebar = ({
  categories,
  brands,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleCategoryChange = (categoryId) => {
    const current = selectedFilters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];
    onFilterChange("categories", updated);
  };

  const handleBrandChange = (brand) => {
    const current = selectedFilters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange("brands", updated);
  };

  const handlePriceChange = (type, value) => {
    onFilterChange(type, value);
  };

  const handleRatingChange = (rating) => {
    onFilterChange(
      "minRating",
      selectedFilters.minRating === rating ? null : rating,
    );
  };

  const hasActiveFilters =
    selectedFilters.categories?.length > 0 ||
    selectedFilters.brands?.length > 0 ||
    selectedFilters.minPrice ||
    selectedFilters.maxPrice ||
    selectedFilters.minRating;

  return (
    <div className={`${isMobile ? "p-[20px]" : ""}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-[24px] pb-[16px] border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">
            {t("shop.filters")}
          </h3>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-accent rounded-full text-foreground"
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full mb-[20px] py-[10px] px-[16px] text-[14px] font-medium text-primary bg-primary/10 rounded-[10px] hover:bg-primary/20 transition-colors"
        >
          {t("shop.clearFilters")}
        </button>
      )}

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("nav.categories")}
        </h4>
        <div className="space-y-[8px]">
          {categories
            .filter((cat) => cat.parentId === null)
            .map((parent) => {
              const children = categories.filter(
                (cat) => cat.parentId === parent.id,
              );
              return (
                <div key={parent.id}>
                  <label className="flex items-center gap-[10px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters.categories?.includes(parent.id) || false
                      }
                      onChange={() => handleCategoryChange(parent.id)}
                      className="w-[18px] h-[18px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {t(`categories.${parent.id}`)}
                    </span>
                  </label>
                  {children.map((child) => (
                    <label
                      key={child.id}
                      className="flex items-center gap-[10px] cursor-pointer group ml-[24px] mt-[6px]"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters.categories?.includes(child.id) ||
                          false
                        }
                        onChange={() => handleCategoryChange(child.id)}
                        className="w-[16px] h-[16px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-[13px] text-muted-foreground group-hover:text-primary transition-colors">
                        {t(`categories.${child.id}`)}
                      </span>
                    </label>
                  ))}
                </div>
              );
            })}
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.priceRange")}
        </h4>
        <div className="flex items-center gap-[8px]">
          <input
            type="number"
            placeholder={t("shop.minPrice")}
            value={selectedFilters.minPrice || ""}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-background rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder={t("shop.maxPrice")}
            value={selectedFilters.maxPrice || ""}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-background rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.brands")}
        </h4>
        <div className="space-y-[8px] max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-[10px] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters.brands?.includes(brand) || false}
                onChange={() => handleBrandChange(brand)}
                className="w-[18px] h-[18px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
              />
              <span className="text-[14px] text-muted-foreground group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.rating")}
        </h4>
        <div className="space-y-[10px]">
          {[4, 3, 2].map((rating) => {
            const isSelected = selectedFilters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary hover:bg-accent text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-[16px] h-[16px] ${
                        i < rating ? "text-amber-400" : "text-muted"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[14px] font-medium">
                  {rating}+ {t("shop.andAbove")}
                </span>
                {isSelected && (
                  <svg
                    className="w-[16px] h-[16px] ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
