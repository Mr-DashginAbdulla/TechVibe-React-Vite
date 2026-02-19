import { Link } from "react-router-dom";
import { Check, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResetSuccess = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px]">
      <div className="w-full max-w-[440px] bg-card rounded-[24px] shadow-xl p-[40px] border border-border">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
            {t("auth.resetPassword")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {t("auth.passwordResetComplete")}
          </p>
        </div>

        <div className="flex justify-center mb-[24px]">
          <div className="w-[72px] h-[72px] bg-success/10 rounded-full flex items-center justify-center">
            <Check className="w-[36px] h-[36px] text-success" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] mb-[24px]">
          <CheckCircle className="w-[18px] h-[18px] text-success shrink-0" />
          <p className="text-[14px] text-success">
            {t("auth.verificationSuccessful")}
          </p>
        </div>

        <div className="text-center mb-[32px]">
          <h2 className="text-[18px] font-semibold text-foreground mb-[8px]">
            {t("auth.passwordResetLinkSent")}
          </h2>
          <p className="text-[14px] text-muted-foreground">
            {t("auth.checkInboxInstructions")}
          </p>
        </div>

        <Link
          to="/auth/login"
          className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
        >
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
};

export default ResetSuccess;
