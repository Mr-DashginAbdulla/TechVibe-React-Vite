import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";

export const CartLoginPrompt = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
      <div className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center mb-[16px]">
        <ShoppingBag className="w-[36px] h-[36px] text-primary" />
      </div>
      <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
        {t("basket.loginRequired")}
      </h3>
      <p className="text-[14px] text-muted-foreground text-center mb-[20px]">
        {t("basket.loginRequiredDesc")}
      </p>
      <Link
        to="/auth/login"
        onClick={onClose}
        className="px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {t("auth.signIn")}
      </Link>
    </div>
  );
};

export const CartEmptyState = ({ onClose, onStartShopping }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
      <div className="relative mb-[20px]">
        <div className="w-[100px] h-[100px] bg-linear-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-[44px] h-[44px] text-primary" />
        </div>
        <div className="absolute -bottom-[4px] -right-[4px] w-[36px] h-[36px] bg-muted rounded-full flex items-center justify-center">
          <span className="text-[18px]">😢</span>
        </div>
      </div>
      <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
        {t("basket.emptyTitle")}
      </h3>
      <p className="text-[14px] text-muted-foreground text-center mb-[20px]">
        {t("basket.emptyDesc")}
      </p>
      <button
        onClick={onStartShopping}
        className="flex items-center gap-[8px] px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {t("basket.startShopping")}
        <ArrowRight className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};
