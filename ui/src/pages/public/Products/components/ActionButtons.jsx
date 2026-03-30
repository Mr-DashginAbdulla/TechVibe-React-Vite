import { ShoppingCart, Heart, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateStockAlertMutation } from "@/store/api/apiSlice";
import { useAuth } from "@/context/AuthContext";

const ActionButtons = ({
  productId,
  stock,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isInWishlist,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [createStockAlert, { isLoading }] = useCreateStockAlertMutation();
  const [alertSent, setAlertSent] = useState(false);

  const handleStockAlert = async () => {
    if (!user) {
      toast.info(t("common.loginRequired") || "Xahiş edirik daxil olun");
      return;
    }

    try {
      await createStockAlert(productId).unwrap();
      setAlertSent(true);
      toast.success(t("productDetails.alertSuccess") || "Məhsul anbarda olduqda sizə bildiriş göndəriləcək.");
    } catch (error) {
      toast.error(error?.data?.message || t("common.error") || "Xəta baş verdi");
    }
  };

  return (
    <div className="flex gap-3 mb-6">
      {stock > 0 ? (
        <>
          <button
            onClick={onAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            <ShoppingCart size={20} />
            {t("productDetails.addToCart")}
          </button>
          <button
            onClick={onBuyNow}
            className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 font-semibold py-4 px-6 rounded-xl transition-all"
          >
            {t("productDetails.buyNow")}
          </button>
        </>
      ) : (
        <button
          onClick={handleStockAlert}
          disabled={isLoading || alertSent}
          className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <Bell size={20} />
          {alertSent ? (t("productDetails.alertSent") || "Bildiriş aktivdir") : (t("productDetails.notifyMe") || "Mövcud olduqda bildir")}
        </button>
      )}

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
