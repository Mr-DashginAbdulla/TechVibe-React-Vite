import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { ArrowRight } from "lucide-react";

const CartDrawerFooter = ({ subtotal, onCheckout, onViewCart }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="p-[16px] border-t border-border bg-muted/30">
      <div className="space-y-[8px] mb-[16px]">
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("basket.subtotal")}</span>
          <span className="text-foreground font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("basket.shipping")}</span>
          <span className="text-success font-medium">{t("basket.free")}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between text-[16px] font-bold">
          <span className="text-foreground">{t("basket.total")}</span>
          <span className="text-primary">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
      >
        {t("basket.checkout")}
        <ArrowRight className="w-[18px] h-[18px]" />
      </button>

      <button
        onClick={onViewCart}
        className="w-full py-[12px] mt-[8px] text-primary font-medium hover:bg-primary/10 rounded-[12px] transition-colors"
      >
        {t("basket.viewFullCart")}
      </button>
    </div>
  );
};

export default CartDrawerFooter;
