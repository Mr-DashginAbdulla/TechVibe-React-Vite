import { ShoppingCart, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const ActionButtons = ({
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isInWishlist,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
      >
        <ShoppingCart size={20} />
        {t("productDetails.addToCart")}
      </button>
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-semibold py-4 px-6 rounded-xl transition-all"
      >
        {t("productDetails.buyNow")}
      </button>
      <button
        onClick={onToggleWishlist}
        className={`shrink-0 w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
          isInWishlist
            ? "border-red-200 bg-red-50 text-red-500"
            : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
        }`}
      >
        <Heart size={22} fill={isInWishlist ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ActionButtons;
