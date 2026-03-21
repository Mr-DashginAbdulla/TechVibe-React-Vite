import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { Package } from "lucide-react";

const OrderItemsList = ({ items, subtotal, shipping, total }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="lg:col-span-2 bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
        {t("order.items")}
      </h2>
      <div className="space-y-[16px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-[16px] p-[16px] bg-muted/50 rounded-[12px]"
          >
            <div className="w-[80px] h-[80px] rounded-[10px] bg-card border border-border overflow-hidden shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-[24px] h-[24px] text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-foreground">
                {item.name}
              </p>

              {item.selectedOptions &&
                Object.keys(item.selectedOptions).length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mt-[4px]">
                    {Object.entries(item.selectedOptions).map(
                      ([key, value]) => {
                        if (!value) return null;
                        const displayValue =
                          value.label || value.value || value;
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-[4px] px-[6px] py-[2px] bg-muted rounded-[4px] text-[11px] text-muted-foreground"
                          >
                            {key === "color" && value.value && (
                              <span
                                className="w-[10px] h-[10px] rounded-full border border-border"
                                style={{ backgroundColor: value.value }}
                              />
                            )}
                            {displayValue}
                          </span>
                        );
                      },
                    )}
                  </div>
                )}
              <p className="text-[13px] text-muted-foreground mt-[2px]">
                {item.brand || ""} {item.color ? `• ${item.color}` : ""}
              </p>
              <div className="flex items-center justify-between mt-[8px]">
                <p className="text-[13px] text-muted-foreground">
                  {t("product.quantity")}: {item.quantity}
                </p>
                <p className="text-[16px] font-bold text-foreground">
                  {formatPrice(item.price || 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[24px] pt-[20px] border-t border-border space-y-[12px]">
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="text-foreground">{formatPrice(subtotal || 0)}</span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span className="text-foreground">{formatPrice(shipping || 0)}</span>
        </div>
        <div className="flex justify-between text-[16px] font-bold pt-[12px] border-t border-border">
          <span className="text-foreground">{t("cart.total")}</span>
          <span className="text-primary">{formatPrice(total || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;
