import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const CheckoutSteps = ({ steps, currentStep }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-[24px] sm:mb-[40px]">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-[6px] sm:gap-[12px] px-[10px] sm:px-[20px] py-[8px] sm:py-[12px] rounded-[12px] sm:rounded-[16px] transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : isCompleted
                      ? "bg-success/10 text-success dark:text-success"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <div
                  className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-primary-foreground/20"
                      : isCompleted
                        ? "bg-success text-white"
                        : "bg-muted-foreground/20"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
                  ) : (
                    <Icon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
                  )}
                </div>
                <span className="font-semibold text-[12px] sm:text-[14px] hidden sm:inline">
                  {t(`checkout.step${step.id}`)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-[20px] sm:w-[60px] h-[3px] mx-[4px] sm:mx-[8px] rounded-full ${
                    currentStep > step.id ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
