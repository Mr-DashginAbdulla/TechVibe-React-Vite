import { Link } from "react-router-dom";
import { CreditCard, ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

const OrderSummarySide = ({ order }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px] sticky top-[24px]">
      <h2 className="text-[18px] font-bold text-foreground mb-[20px]">
        {t("basket.orderSummary")}
      </h2>

      <div className="space-y-[12px] mb-[20px]">
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("basket.subtotal")}</span>
          <span className="text-foreground font-medium">
            {formatPrice(order.subtotal || 0)}
          </span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("basket.shipping")}</span>
          <span className="text-foreground font-medium">
            {formatPrice(order.shippingCost || 0)}
          </span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("checkout.tax")}</span>
          <span className="text-foreground font-medium">
            {formatPrice(order.tax || 0)}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-[14px]">
            <span className="text-success">{t("checkout.discount")}</span>
            <span className="text-success font-medium">
              -{formatPrice(order.discount || 0)}
            </span>
          </div>
        )}
        <div className="h-px bg-border" />
        <div className="flex justify-between text-[18px] font-bold">
          <span className="text-foreground">{t("basket.total")}</span>
          <span className="text-primary">{formatPrice(order.total || 0)}</span>
        </div>
      </div>

      <div className="p-[16px] bg-muted/30 rounded-[12px] mb-[20px]">
        <div className="flex items-center gap-[12px]">
          <CreditCard className="w-[20px] h-[20px] text-muted-foreground" />
          <div>
            <p className="text-[13px] text-muted-foreground">
              {t("order.paymentMethod")}
            </p>
            <p className="text-[14px] font-semibold text-foreground">
              {t(`checkout.payment.${order.paymentMethod || "card"}`)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-[12px]">
        <Link
          to={`/profile/orders/${order.id}`}
          className="w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
        >
          {t("order.viewDetails")}
          <ArrowRight className="w-[18px] h-[18px]" />
        </Link>
        <Link
          to="/"
          className="w-full py-[14px] bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
        >
          <ShoppingBag className="w-[18px] h-[18px]" />
          {t("basket.continueShopping")}
        </Link>
      </div>
    </div>
  );
};

export default OrderSummarySide;
