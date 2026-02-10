import FilterSidebar from "./FilterSidebar";

const MobileFilter = ({
  isOpen,
  onClose,
  categories,
  brands,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-[320px] max-w-[90vw] bg-background z-50 overflow-y-auto border-r border-border">
        <FilterSidebar
          categories={categories}
          brands={brands}
          selectedFilters={{
            categories: filters.categories,
            brands: filters.brands,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRating: filters.minRating,
          }}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          isMobile={true}
          onClose={onClose}
        />
      </div>
    </>
  );
};

export default MobileFilter;
