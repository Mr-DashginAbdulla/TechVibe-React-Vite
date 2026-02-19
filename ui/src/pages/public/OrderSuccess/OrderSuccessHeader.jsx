import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderSuccessHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-[48px]">
      <div className="w-[80px] h-[80px] bg-success/10 dark:bg-success/10 rounded-full flex items-center justify-center mx-auto mb-[24px]">
        <CheckCircle className="w-[48px] h-[48px] text-success" />
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
