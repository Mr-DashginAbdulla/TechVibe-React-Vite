import { Truck, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderStatusTracker = () => {
  const { t } = useTranslation();

  const steps = [
    {
      status: "confirmed",
      label: t("checkout.status.confirmed"),
      done: true,
    },
    {
      status: "processing",
      label: t("checkout.status.processing"),
      done: false,
    },
    {
      status: "shipped",
      label: t("checkout.status.shipped"),
      done: false,
    },
    {
      status: "delivered",
      label: t("checkout.status.delivered"),
      done: false,
    },
  ];

  return (
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
      <h2 className="text-[18px] font-bold text-foreground mb-[20px] flex items-center gap-[10px]">
        <Truck className="w-[20px] h-[20px] text-primary" />
        {t("checkout.orderStatus")}
      </h2>
      <div className="space-y-0">
        {steps.map((step, index, arr) => (
          <div key={step.status} className="flex gap-[16px]">
            <div className="flex flex-col items-center">
              <div
                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                  step.done ? "bg-success" : "bg-muted"
                }`}
              >
                {step.done && (
                  <CheckCircle className="w-[14px] h-[14px] text-white" />
                )}
              </div>
              {index < arr.length - 1 && (
                <div
                  className={`w-[2px] h-[40px] ${
                    step.done ? "bg-success/50" : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="pb-[16px]">
              <p
                className={`text-[15px] font-medium ${
                  step.done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {step.done && (
                <p className="text-[13px] text-muted-foreground">
                  {new Date().toLocaleDateString("az-AZ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
