import { useTranslation } from "react-i18next";

const ComparisonTable = ({
  product,
  selectedProduct,
  allSpecKeys,
  translateSpecKey,
}) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
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

        <div className="divide-y divide-border">
          {allSpecKeys.map((specKey, idx) => (
            <div
              key={specKey}
              className={`grid grid-cols-3 ${idx % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-primary/3 transition-colors`}
            >
              <div className="px-6 py-4 text-sm font-medium text-foreground">
                {translateSpecKey(specKey)}
              </div>
              <div className="px-6 py-4 text-sm text-center border-x-2 border-primary bg-primary/6">
                <span
                  className={
                    product.specs?.[specKey]
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }
                >
                  {product.specs?.[specKey] || t("productDetails.notAvailable")}
                </span>
              </div>
              <div className="px-6 py-4 text-sm text-center">
                <span
                  className={
                    selectedProduct.specs?.[specKey]
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }
                >
                  {selectedProduct.specs?.[specKey] ||
                    t("productDetails.notAvailable")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
