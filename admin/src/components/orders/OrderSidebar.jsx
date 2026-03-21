import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

const OrderSidebar = ({ order, onStatusUpdate, getStatusBadge }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-[16px]">
      <div className="bg-card rounded-[16px] border border-border p-[20px]">
        <h3 className="text-[15px] font-semibold text-foreground mb-[12px]">
          {t("orders.updateStatus")}
        </h3>
        <div className="flex flex-wrap gap-[8px]">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onStatusUpdate(status)}
              className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition-colors ${
                order.status === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-foreground hover:bg-border"
              }`}
            >
              {t(`orders.${status}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-[16px] border border-border p-[20px]">
        <h3 className="text-[15px] font-semibold text-foreground mb-[12px]">
          {t("orders.customerInfo")}
        </h3>
        <div className="space-y-[8px] text-[14px]">
          <p className="text-foreground font-medium">{order.customer?.name}</p>
          <p className="text-muted-foreground">{order.customer?.email}</p>
          <p className="text-muted-foreground">{order.customer?.phone}</p>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-card rounded-[16px] border border-border p-[20px]">
          <h3 className="text-[15px] font-semibold text-foreground mb-[12px]">
            {t("orders.shippingAddress")}
          </h3>
          <div className="text-[14px] text-muted-foreground space-y-[4px]">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-[16px] border border-border p-[20px]">
        <h3 className="text-[15px] font-semibold text-foreground mb-[12px]">
          {t("orders.orderSummary")}
        </h3>
        <div className="space-y-[8px] text-[14px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("orders.subtotal")}
            </span>
            <span className="text-foreground">
              {formatPrice(order.subtotal || order.total || 0)}
            </span>
          </div>
          {order.shipping !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("orders.shipping")}
              </span>
              <span className="text-foreground">
                {formatPrice(order.shipping || 0)}
              </span>
            </div>
          )}
          {order.tax !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("orders.tax")}</span>
              <span className="text-foreground">{formatPrice(order.tax || 0)}</span>
            </div>
          )}
          <div className="flex justify-between pt-[8px] border-t border-border">
            <span className="text-foreground font-semibold">
              {t("orders.grandTotal")}
            </span>
            <span className="text-foreground font-bold">
              {formatPrice(order.total || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;
