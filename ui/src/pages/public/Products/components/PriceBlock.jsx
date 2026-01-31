import { Zap, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const PriceBlock = ({ price, oldPrice, stock }) => {
  const { t } = useTranslation();

  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const savings = oldPrice ? (oldPrice - price).toFixed(2) : 0;

  return (
    <div className="mb-6">
      {/* Price Row */}
      <div className="flex items-end gap-3 mb-2">
        <span className="text-3xl font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
        {oldPrice && (
          <span className="text-lg text-gray-400 line-through mb-0.5">
            ${oldPrice.toFixed(2)}
          </span>
        )}
        {oldPrice && (
          <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-2.5 py-1 rounded-md mb-0.5">
            {t("productDetails.save")} ${savings}
          </span>
        )}
      </div>

      {/* Discount Info */}
      {discount > 0 && (
        <p className="text-emerald-600 text-sm font-medium flex items-center gap-1.5 mb-4">
          <Zap size={14} className="fill-current" />
          {discount}% {t("productDetails.off")} -{" "}
          {t("productDetails.limitedOffer")}
        </p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {stock > 0 ? (
          <>
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-sm font-medium text-emerald-600">
              {t("productDetails.inStock")} - {t("productDetails.shipsWithin")}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-sm font-medium text-red-500">
              {t("productDetails.outOfStock")}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceBlock;
