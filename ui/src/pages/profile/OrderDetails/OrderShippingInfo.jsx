import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

const OrderShippingInfo = ({ shippingAddress }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <div className="flex items-center gap-[12px] mb-[16px]">
        <div className="w-[40px] h-[40px] bg-muted rounded-[10px] flex items-center justify-center">
          <MapPin className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
        <h3 className="text-[16px] font-semibold text-foreground">
          {t("order.shippingAddress")}
        </h3>
      </div>
      <div className="text-[14px] text-foreground space-y-[4px]">
        <p className="font-medium">{shippingAddress.name}</p>
        <p>{shippingAddress.address}</p>
        <p>
          {shippingAddress.city}, {shippingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default OrderShippingInfo;
