import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { Search } from "lucide-react";

const ProductPicker = ({
  searchQuery,
  setSearchQuery,
  searchInputRef,
  availableProducts,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 w-[220px] md:w-[280px] max-h-[360px] bg-card border border-border rounded-xl shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border text-muted-foreground">
        <Search size={16} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={t("productDetails.searchProducts")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none outline-none bg-transparent text-[0.8rem] text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div
        className="max-h-[300px] overflow-y-auto p-1"
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: "contain", scrollBehavior: "smooth" }}
      >
        {availableProducts.length === 0 ? (
          <div className="py-6 px-4 text-center text-[0.8rem] text-muted-foreground">
            {t("productDetails.noResults")}
          </div>
        ) : (
          availableProducts.slice(0, 10).map((p) => (
            <button
              key={p.id}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-left"
              onClick={() => onSelect(p.id)}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-9 h-9 object-contain rounded-md bg-background shrink-0"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {p.name}
                </span>
                <span className="text-[0.7rem] font-bold text-primary">
                  {formatPrice(p.price)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPicker;
