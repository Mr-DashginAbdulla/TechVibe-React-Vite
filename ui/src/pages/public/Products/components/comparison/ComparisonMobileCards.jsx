import { useTranslation } from "react-i18next";

const ComparisonMobileCards = ({
  product,
  selectedProduct,
  allSpecKeys,
  translateSpecKey,
}) => {
  const { t } = useTranslation();

  return (
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
                {product.specs?.[specKey] || t("productDetails.notAvailable")}
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
  );
};

export default ComparisonMobileCards;
