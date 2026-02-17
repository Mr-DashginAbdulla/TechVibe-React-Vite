import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderItemsList = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
      <h2 className="text-[18px] font-bold text-foreground mb-[20px] flex items-center gap-[10px]">
        <Package className="w-[20px] h-[20px] text-primary" />
        {t("order.items")}
      </h2>
      <div className="space-y-[16px]">
        {items?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-[16px] p-[16px] bg-muted/30 rounded-[14px]"
          >
            <div className="w-[64px] h-[64px] bg-background rounded-[10px] overflow-hidden border border-border shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-foreground line-clamp-1">
                {item.name}
              </p>
              <p className="text-[14px] text-muted-foreground">
                {t("product.quantity")}: {item.quantity}
              </p>
            </div>
            <p className="text-[16px] font-bold text-foreground">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
