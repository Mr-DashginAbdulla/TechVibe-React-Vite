import { ShieldCheck, Lock, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustBadges = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-[32px] mt-[24px]">
      <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
        <ShieldCheck className="w-[18px] h-[18px] text-success" />
        {t("checkout.secureCheckout")}
      </div>
      <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
        <Lock className="w-[18px] h-[18px] text-success" />
        {t("checkout.sslEncrypted")}
      </div>
      <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
        <Truck className="w-[18px] h-[18px] text-success" />
        {t("checkout.fastDelivery")}
      </div>
    </div>
  );
};

export default TrustBadges;
