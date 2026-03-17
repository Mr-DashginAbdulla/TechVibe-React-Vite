import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { authService } from "@/services/authService";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      number: 1,
      title: t("auth.email"),
      description: t("auth.forgotPasswordDesc"),
    },
    {
      number: 2,
      title: t("auth.verificationCode"),
      description: t("auth.enter6DigitCode"),
    },
    {
      number: 3,
      title: t("auth.resetPassword"),
      description: t("profile.newPassword"),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("validation.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("validation.invalidEmail"));
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(email);
      toast.success(t("messages.resetLinkSent", "A password reset link has been sent to your email."));
      navigate("/auth/login");
    } catch (err) {
      toast.error(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px]">
      <Helmet>
        <title>{t("auth.forgotPasswordTitle")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[440px]">
        <div className="bg-card rounded-[24px] shadow-xl p-[40px] mb-[24px] border border-border">
          <div className="w-[64px] h-[64px] bg-primary/10 rounded-[16px] flex items-center justify-center mx-auto mb-[24px]">
            <Mail className="w-[32px] h-[32px] text-primary" />
          </div>

          <div className="text-center mb-[32px]">
            <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
              {t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {t("auth.forgotPasswordDesc")}
            </p>
          </div>

          <form className="space-y-[20px]" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  {t("auth.sending")}
                </>
              ) : (
                <>
                  {t("auth.sendResetLink")}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </>
              )}
            </button>
          </form>

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-[8px] w-full mt-[20px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-[16px] h-[16px]" />
            {t("auth.backToLogin")}
          </Link>
        </div>

        <div className="bg-card rounded-[20px] shadow-lg p-[24px] border border-border">
          <h3 className="text-[15px] font-semibold text-foreground mb-[16px]">
            Password Reset Process
          </h3>
          <div className="space-y-[12px]">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-[12px]">
                <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 bg-primary">
                  <span className="text-[13px] font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
