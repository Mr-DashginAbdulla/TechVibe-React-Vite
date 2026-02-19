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
        className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
      >
        <ShoppingCart size={20} />
        {t("productDetails.addToCart")}
      </button>
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 disabled:border-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-semibold py-4 px-6 rounded-xl transition-all"
      >
        {t("productDetails.buyNow")}
      </button>
      <button
        onClick={onToggleWishlist}
        className={`shrink-0 w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
          isInWishlist
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : "border-border text-muted-foreground hover:border-destructive/30 hover:text-destructive"
        }`}
      >
        <Heart size={22} fill={isInWishlist ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ActionButtons;
