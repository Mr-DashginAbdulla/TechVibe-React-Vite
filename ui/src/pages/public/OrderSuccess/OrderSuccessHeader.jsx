import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderSuccessHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-[48px]">
      <div className="w-[80px] h-[80px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-[24px]">
        <CheckCircle className="w-[48px] h-[48px] text-emerald-500" />
      </div>
      <h1 className="text-[32px] font-bold text-foreground mb-[12px]">
        {t("checkout.orderConfirmed")}
      </h1>
      <p className="text-[16px] text-muted-foreground max-w-[500px] mx-auto">
        {t("checkout.thankYou")}
      </p>
    </div>
  );
};

export default OrderSuccessHeader;
