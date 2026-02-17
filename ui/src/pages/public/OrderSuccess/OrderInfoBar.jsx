import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderInfoBar = ({ order, estimatedDelivery }) => {
  const { t } = useTranslation();

  if (!order) return null;

  return (
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[32px] mb-[24px]">
      <div className="flex flex-wrap items-center justify-center gap-[32px] mb-[32px]">
        <div className="text-center">
          <p className="text-[13px] text-muted-foreground mb-[4px]">
            {t("order.orderNumber")}
          </p>
          <p className="text-[20px] font-bold text-foreground">
            {order.orderNumber || order.id}
          </p>
        </div>
        <div className="w-px h-[40px] bg-border hidden sm:block" />
        <div className="text-center">
          <p className="text-[13px] text-muted-foreground mb-[4px]">
            {t("order.orderDate")}
          </p>
          <p className="text-[16px] font-semibold text-foreground">
            {new Date(order.createdAt).toLocaleDateString("az-AZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="w-px h-[40px] bg-border hidden sm:block" />
        <div className="text-center">
          <p className="text-[13px] text-muted-foreground mb-[4px]">
            {t("checkout.estimatedDelivery")}
          </p>
          <p className="text-[16px] font-semibold text-emerald-600 dark:text-emerald-400">
            {estimatedDelivery.toLocaleDateString("az-AZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[12px] p-[16px] bg-blue-50 dark:bg-blue-900/20 rounded-[12px] border border-blue-100 dark:border-blue-800">
        <Mail className="w-[20px] h-[20px] text-blue-600 dark:text-blue-400" />
        <p className="text-[14px] text-blue-600 dark:text-blue-400">
          {t("checkout.emailSent")}
        </p>
      </div>
    </div>
  );
};

export default OrderInfoBar;
