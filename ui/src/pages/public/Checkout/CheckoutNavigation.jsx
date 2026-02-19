import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const CheckoutNavigation = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  handlePlaceOrder,
  canProceed,
  isSubmitting,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-[32px] pt-[24px] border-t border-border">
      <button
        onClick={handleBack}
        disabled={currentStep === 1}
        className={`flex items-center gap-[8px] px-[24px] py-[14px] rounded-[12px] font-semibold transition-colors ${
          currentStep === 1
            ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
            : "bg-muted text-foreground hover:bg-muted/80"
        }`}
      >
        <ArrowLeft className="w-[18px] h-[18px]" />
        {t("common.back")}
      </button>

      {currentStep < totalSteps ? (
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center gap-[8px] px-[24px] py-[14px] rounded-[12px] font-semibold transition-colors ${
            canProceed()
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground/50 cursor-not-allowed"
          }`}
        >
          {t("common.next")}
          <ArrowRight className="w-[18px] h-[18px]" />
        </button>
      ) : (
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="flex items-center gap-[8px] px-[32px] py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="animate-pulse">{t("common.loading")}</span>
          ) : (
            <>
              <Check className="w-[18px] h-[18px]" />
              {t("checkout.placeOrder")}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CheckoutNavigation;
