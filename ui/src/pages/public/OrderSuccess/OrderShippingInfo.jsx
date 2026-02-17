import { MapPin, Home, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderShippingInfo = ({ shippingAddress }) => {
  const { t } = useTranslation();

  if (!shippingAddress) return null;

  return (
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
      <h2 className="text-[18px] font-bold text-foreground mb-[16px] flex items-center gap-[10px]">
        <MapPin className="w-[20px] h-[20px] text-primary" />
        {t("order.shippingAddress")}
      </h2>
      <div className="flex items-start gap-[16px] p-[16px] bg-muted/30 rounded-[14px]">
        <div className="w-[44px] h-[44px] bg-background rounded-[10px] flex items-center justify-center border border-border shrink-0">
          {shippingAddress.label === "Home" ? (
            <Home className="w-[20px] h-[20px] text-muted-foreground" />
          ) : (
            <Building2 className="w-[20px] h-[20px] text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-foreground">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-[14px] text-muted-foreground mt-[4px]">
            {shippingAddress.address}
          </p>
          <p className="text-[14px] text-muted-foreground">
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.zipCode}
          </p>
          <p className="text-[14px] text-muted-foreground">
            {shippingAddress.country}
          </p>
          <p className="text-[14px] text-muted-foreground mt-[4px]">
            📞 {shippingAddress.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderShippingInfo;
