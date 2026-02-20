import { useTranslation } from "react-i18next";
import useProductComparison from "./comparison/useProductComparison";
import ComparisonSlots from "./comparison/ComparisonSlots";
import ComparisonTable from "./comparison/ComparisonTable";
import ComparisonMobileCards from "./comparison/ComparisonMobileCards";

const ProductComparison = ({ product }) => {
  const { t } = useTranslation();

  const {
    selectedProduct,
    availableProducts,
    allSpecKeys,
    showPicker,
    searchQuery,
    setSearchQuery,
    dropdownRef,
    searchInputRef,
    translateSpecKey,
    handleAddProduct,
    handleRemoveProduct,
    togglePicker,
  } = useProductComparison(product);

  if (!product?.specs || Object.keys(product.specs).length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {t("productDetails.compareTitle")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("productDetails.compareSubtitle")}
      </p>

      <ComparisonSlots
        product={product}
        selectedProduct={selectedProduct}
        showPicker={showPicker}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInputRef={searchInputRef}
        dropdownRef={dropdownRef}
        availableProducts={availableProducts}
        onAdd={handleAddProduct}
        onRemove={handleRemoveProduct}
        onTogglePicker={togglePicker}
      />

      {selectedProduct && (
        <>
          <ComparisonTable
            product={product}
            selectedProduct={selectedProduct}
            allSpecKeys={allSpecKeys}
            translateSpecKey={translateSpecKey}
          />
          <ComparisonMobileCards
            product={product}
            selectedProduct={selectedProduct}
            allSpecKeys={allSpecKeys}
            translateSpecKey={translateSpecKey}
          />
        </>
      )}

      {!selectedProduct && (
        <div className="text-center py-8 px-4 text-muted-foreground text-sm border border-dashed border-border rounded-xl bg-background">
          {t("productDetails.selectToCompare")}
        </div>
      )}
    </div>
  );
};

export default ProductComparison;
