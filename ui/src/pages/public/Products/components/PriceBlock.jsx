import { Zap, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

const PriceBlock = ({ price, oldPrice, stock }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const savings = oldPrice ? (oldPrice - price).toFixed(2) : 0;

  return (
    <div className="mb-6">
      <div className="flex items-end gap-3 mb-2">
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(price)}
        </span>
        {oldPrice && (
          <span className="text-lg text-muted-foreground line-through mb-0.5">
            {formatPrice(oldPrice)}
          </span>
        )}
        {oldPrice && (
          <span className="bg-primary/10 text-primary text-sm font-semibold px-2.5 py-1 rounded-md mb-0.5">
            {t("productDetails.save")} {formatPrice(savings)}
          </span>
        )}
      </div>

      {discount > 0 && (
        <p className="text-success text-sm font-medium flex items-center gap-1.5 mb-4">
          <Zap size={14} className="fill-current" />
          {discount}% {t("productDetails.off")} -{" "}
          {t("productDetails.limitedOffer")}
        </p>
      )}

      <div className="flex items-center gap-2">
        {stock > 0 ? (
          <>
            <span className="w-2 h-2 bg-success rounded-full"></span>
            <span className="text-sm font-medium text-success">
              {t("productDetails.inStock")} - {t("productDetails.shipsWithin")}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-destructive rounded-full"></span>
            <span className="text-sm font-medium text-destructive">
              {t("productDetails.outOfStock")}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceBlock;
