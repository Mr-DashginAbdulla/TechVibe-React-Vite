import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";

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

  const hasActiveFilters =
    selectedFilters.categories?.length > 0 ||
    selectedFilters.brands?.length > 0 ||
    selectedFilters.minPrice ||
    selectedFilters.maxPrice;

  const CustomCheckbox = ({ checked, onChange, label, className = "" }) => (
    <label
      className={`flex items-center gap-[12px] cursor-pointer group ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-[20px] h-[20px] rounded-[6px] border transition-all duration-200 flex items-center justify-center ${
            checked
              ? "bg-primary border-primary"
              : "bg-card border-input group-hover:border-primary"
          }`}
        >
          <Check
            className={`w-[14px] h-[14px] text-primary-foreground transition-transform duration-200 ${
              checked ? "scale-100" : "scale-0"
            }`}
            strokeWidth={3}
          />
        </div>
      </div>
      <span
        className={`text-[14px] font-medium transition-colors duration-200 ${
          checked
            ? "text-foreground"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {label}
      </span>
    </label>
  );

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
        <h4 className="text-[14px] font-semibold text-foreground mb-[16px] uppercase tracking-wide">
          {t("nav.categories")}
        </h4>
        <div className="space-y-[10px]">
          {categories
            .filter((cat) => cat.parentId === null)
            .map((parent) => {
              const children = categories.filter(
                (cat) => cat.parentId === parent.id,
              );
              return (
                <div key={parent.id} className="space-y-[8px]">
                  <CustomCheckbox
                    checked={
                      selectedFilters.categories?.includes(parent.id) || false
                    }
                    onChange={() => handleCategoryChange(parent.id)}
                    label={t(`categories.${parent.id}`)}
                  />
                  {children.length > 0 && (
                    <div className="ml-[10px] pl-[14px] border-l-2 border-border space-y-[8px]">
                      {children.map((child) => (
                        <CustomCheckbox
                          key={child.id}
                          checked={
                            selectedFilters.categories?.includes(child.id) ||
                            false
                          }
                          onChange={() => handleCategoryChange(child.id)}
                          label={t(`categories.${child.id}`)}
                          className="!gap-[10px]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[16px] uppercase tracking-wide">
          {t("shop.priceRange")}
        </h4>
        <div className="flex items-center gap-[8px]">
          <input
            type="number"
            placeholder={t("shop.minPrice")}
            value={selectedFilters.minPrice || ""}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-card rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder={t("shop.maxPrice")}
            value={selectedFilters.maxPrice || ""}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-card rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[16px] uppercase tracking-wide">
          {t("shop.brands")}
        </h4>
        <div className="space-y-[10px] max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <CustomCheckbox
              key={brand}
              checked={selectedFilters.brands?.includes(brand) || false}
              onChange={() => handleBrandChange(brand)}
              label={brand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
