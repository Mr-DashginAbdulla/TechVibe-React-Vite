import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const CartSummary = ({ subtotal }) => {
  const { t } = useTranslation();

  return (
    <div className="p-[20px] bg-muted/30 border-t border-border">
      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-[15px] text-muted-foreground">
          {t("basket.subtotal")}
        </span>
        <span className="text-[15px] font-medium text-foreground">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center justify-between mb-[16px]">
        <span className="text-[15px] text-muted-foreground">
          {t("basket.shipping")}
        </span>
        <span className="text-[15px] font-medium text-success">
          {t("basket.free")}
        </span>
      </div>
      <div className="h-px bg-border mb-[16px]" />
      <div className="flex items-center justify-between mb-[20px]">
        <span className="text-[17px] font-bold text-foreground">
          {t("basket.total")}
        </span>
        <span className="text-[20px] font-bold text-primary">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <Link
        to="/checkout"
        className="flex items-center justify-center gap-[8px] w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {t("basket.checkout")}
        <ArrowRight className="w-[18px] h-[18px]" />
      </Link>
    </div>
  );
};

export default CartSummary;
