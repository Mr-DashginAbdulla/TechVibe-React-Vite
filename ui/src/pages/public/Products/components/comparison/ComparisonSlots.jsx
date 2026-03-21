import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { Plus, X, ArrowLeftRight } from "lucide-react";
import ProductPicker from "./ProductPicker";

const ComparisonSlots = ({
  product,
  selectedProduct,
  showPicker,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  dropdownRef,
  availableProducts,
  onAdd,
  onRemove,
  onTogglePicker,
}) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="flex items-center gap-3 md:gap-4 mb-6">
      <div className="flex-1 flex flex-col items-center gap-2 p-3 md:p-5 rounded-xl bg-card border-2 border-primary shadow-[0_0_0_3px_hsl(var(--primary-hsl)/0.1)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 md:w-[60px] md:h-[60px] object-contain rounded-lg"
        />
        <span className="text-[0.7rem] md:text-[0.8rem] font-semibold text-foreground text-center line-clamp-2 max-w-[100px] md:max-w-[140px]">
          {product.name}
        </span>
        <span className="text-xs md:text-sm font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-[0.65rem] font-bold uppercase tracking-wide">
          {t("productDetails.thisProduct")}
        </span>
      </div>

      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
        <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      {selectedProduct ? (
        <div className="flex-1 relative flex flex-col items-center gap-2 p-3 md:p-5 rounded-xl bg-card border border-border hover:border-muted-foreground transition-colors">
          <button
            className="absolute top-1.5 right-1.5 w-[22px] h-[22px] flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-white transition-colors cursor-pointer"
            onClick={onRemove}
            aria-label={t("productDetails.removeProduct")}
          >
            <X size={14} />
          </button>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-12 h-12 md:w-[60px] md:h-[60px] object-contain rounded-lg"
          />
          <span className="text-[0.7rem] md:text-[0.8rem] font-semibold text-foreground text-center line-clamp-2 max-w-[100px] md:max-w-[140px]">
            {selectedProduct.name}
          </span>
          <span className="text-xs md:text-sm font-bold text-primary">
            {formatPrice(selectedProduct.price)}
          </span>
          <Link
            to={`/product/${selectedProduct.id}`}
            className="text-[0.7rem] font-semibold text-primary hover:underline hover:opacity-80 transition-opacity"
          >
            {t("productDetails.viewProduct")}
          </Link>
        </div>
      ) : (
        <div className="flex-1 relative" ref={dropdownRef}>
          <button
            className="w-full flex flex-col items-center justify-center gap-2 p-3 md:p-5 rounded-xl bg-background border-2 border-dashed border-border hover:border-primary hover:bg-primary/3 transition-colors min-h-[130px] md:min-h-[160px] cursor-pointer"
            onClick={onTogglePicker}
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
            <span className="text-[0.65rem] md:text-xs font-semibold text-muted-foreground">
              {t("productDetails.addProduct")}
            </span>
          </button>

          {showPicker && (
            <ProductPicker
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchInputRef={searchInputRef}
              availableProducts={availableProducts}
              onSelect={onAdd}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSlots;
