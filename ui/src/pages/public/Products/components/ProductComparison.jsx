import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Plus, X, Search, ArrowLeftRight } from "lucide-react";
import { useGetAllProductsQuery } from "@/store/api/productsApi";

const ProductComparison = ({ product }) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: allProducts = [] } = useGetAllProductsQuery();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPicker(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPicker && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showPicker]);

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === selectedId) || null,
    [selectedId, allProducts],
  );

  const availableProducts = useMemo(() => {
    const excludeIds = new Set([product.id]);
    if (selectedId) excludeIds.add(selectedId);
    return allProducts
      .filter((p) => !excludeIds.has(p.id))
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      });
  }, [allProducts, product.id, selectedId, searchQuery]);

  const allSpecKeys = useMemo(() => {
    const compared = selectedProduct ? [product, selectedProduct] : [product];
    const keysSet = new Set();
    compared.forEach((p) => {
      if (p.specs) Object.keys(p.specs).forEach((k) => keysSet.add(k));
    });
    return Array.from(keysSet);
  }, [product, selectedProduct]);

  const translateSpecKey = (key) => {
    const translationKey = `specs.${key.replace(/\s+/g, "")}`;
    const translation = t(translationKey, { defaultValue: "" });
    return translation || key;
  };

  const handleAddProduct = (productId) => {
    setSelectedId(productId);
    setShowPicker(false);
    setSearchQuery("");
  };

  if (!product?.specs || Object.keys(product.specs).length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {t("productDetails.compareTitle")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("productDetails.compareSubtitle")}
      </p>

      {/* Product Selection Slots */}
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        {/* Current product */}
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
            ${product.price}
          </span>
          <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-[0.65rem] font-bold uppercase tracking-wide">
            {t("productDetails.thisProduct")}
          </span>
        </div>

        {/* VS divider */}
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
          <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
        </div>

        {/* Second slot */}
        {selectedProduct ? (
          <div className="flex-1 relative flex flex-col items-center gap-2 p-3 md:p-5 rounded-xl bg-card border border-border hover:border-muted-foreground transition-colors">
            <button
              className="absolute top-1.5 right-1.5 w-[22px] h-[22px] flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-white transition-colors cursor-pointer"
              onClick={() => setSelectedId(null)}
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
              ${selectedProduct.price}
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
              className="w-full flex flex-col items-center justify-center gap-2 p-3 md:p-5 rounded-xl bg-background border-2 border-dashed border-border hover:border-primary hover:bg-primary/[0.03] transition-colors min-h-[130px] md:min-h-[160px] cursor-pointer"
              onClick={() => {
                setShowPicker(!showPicker);
                setSearchQuery("");
              }}
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
              <span className="text-[0.65rem] md:text-xs font-semibold text-muted-foreground">
                {t("productDetails.addProduct")}
              </span>
            </button>

            {showPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 z-50 w-[220px] md:w-[280px] max-h-[360px] bg-card border border-border rounded-xl shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
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
                  style={{
                    overscrollBehavior: "contain",
                    scrollBehavior: "smooth",
                  }}
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
                        onClick={() => handleAddProduct(p.id)}
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
                            ${p.price}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Table — hidden on mobile */}
      {selectedProduct && (
        <div className="hidden md:block">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-muted/50 border-b-2 border-border">
              <div className="px-6 py-3 text-sm font-semibold text-foreground">
                {t("productDetails.specification")}
              </div>
              <div className="px-6 py-3 text-sm font-semibold text-foreground text-center border-x-2 border-primary bg-primary/10">
                {product.name}
              </div>
              <div className="px-6 py-3 text-sm font-semibold text-foreground text-center">
                {selectedProduct.name}
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-border">
              {allSpecKeys.map((specKey, idx) => (
                <div
                  key={specKey}
                  className={`grid grid-cols-3 ${idx % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-primary/[0.03] transition-colors`}
                >
                  <div className="px-6 py-4 text-sm font-medium text-foreground">
                    {translateSpecKey(specKey)}
                  </div>
                  <div className="px-6 py-4 text-sm text-center border-x-2 border-primary bg-primary/[0.06]">
                    {product.specs?.[specKey] ? (
                      <span className="text-muted-foreground">
                        {product.specs[specKey]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">
                        {t("productDetails.notAvailable")}
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-4 text-sm text-center">
                    {selectedProduct.specs?.[specKey] ? (
                      <span className="text-muted-foreground">
                        {selectedProduct.specs[specKey]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">
                        {t("productDetails.notAvailable")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cards — hidden on desktop */}
      {selectedProduct && (
        <div className="md:hidden space-y-3">
          {allSpecKeys.map((specKey) => (
            <div
              key={specKey}
              className="bg-card border border-border rounded-xl p-3.5"
            >
              <div className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground mb-2 pb-1.5 border-b border-border">
                {translateSpecKey(specKey)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5 pl-2.5 border-l-2 border-primary">
                  <span className="text-[0.625rem] font-semibold text-muted-foreground/70 truncate">
                    {product.name}
                  </span>
                  <span className="text-[0.8rem] font-medium text-foreground leading-snug">
                    {product.specs?.[specKey] ||
                      t("productDetails.notAvailable")}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.625rem] font-semibold text-muted-foreground/70 truncate">
                    {selectedProduct.name}
                  </span>
                  <span className="text-[0.8rem] font-medium text-foreground leading-snug">
                    {selectedProduct.specs?.[specKey] ||
                      t("productDetails.notAvailable")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!selectedProduct && (
        <div className="text-center py-8 px-4 text-muted-foreground text-sm border border-dashed border-border rounded-xl bg-background">
          {t("productDetails.selectToCompare")}
        </div>
      )}
    </div>
  );
};

export default ProductComparison;
