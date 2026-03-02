import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, ArrowRight } from "lucide-react";

const EmptyCart = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-[60px] px-[24px]">
      <div className="relative mb-[20px]">
        <div className="w-[80px] h-[80px] bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-[36px] h-[36px] text-primary" />
        </div>
      </div>
      <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
        {t("basket.emptyTitle")}
      </h3>
      <p className="text-[14px] text-muted-foreground text-center mb-[20px] max-w-[300px]">
        {t("basket.emptyDesc")}
      </p>
      <Link
        to="/"
        className="flex items-center gap-[8px] px-[20px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {t("basket.startShopping")}
        <ArrowRight className="w-[18px] h-[18px]" />
      </Link>
    </div>
  );
};

export default EmptyCart;
