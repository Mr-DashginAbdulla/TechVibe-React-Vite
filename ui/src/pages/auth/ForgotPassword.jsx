import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const steps = [
    {
      number: 1,
      title: t("auth.email"),
      description: t("auth.forgotPasswordDesc"),
    },
    {
      number: 2,
      title: t("messages.resetLinkSent").split("!")[0],
      description: t("auth.sendResetLink"),
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
      const userExists = await authService.checkEmailExists(email);

      if (userExists) {
        setEmailSent(true);
        toast.success(t("messages.resetLinkSent"));
      } else {
        toast.error(t("messages.userNotFound"));
      }
    } catch (err) {
      toast.error(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-[16px]">
      <Helmet>
        <title>{t("auth.forgotPasswordTitle")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[24px] shadow-xl p-[40px] mb-[24px]">
          <div className="w-[64px] h-[64px] bg-[#3B82F6]/10 rounded-[16px] flex items-center justify-center mx-auto mb-[24px]">
            <Mail className="w-[32px] h-[32px] text-[#3B82F6]" />
          </div>

          <div className="text-center mb-[32px]">
            <h1 className="text-[28px] font-bold text-[#111827] mb-[8px]">
              {emailSent
                ? t("messages.resetLinkSent").split("!")[0] + "!"
                : t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-[15px] text-[#6B7280]">
              {emailSent ? `${email}` : t("auth.forgotPasswordDesc")}
            </p>
          </div>

          {!emailSent ? (
            <form className="space-y-[20px]" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-[2px] focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-[8px] w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#93C5FD] text-white font-semibold py-[14px] rounded-[12px] transition-colors"
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
          ) : (
            <div className="space-y-[20px]">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="flex items-center justify-center gap-[8px] w-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-semibold py-[14px] rounded-[12px] transition-colors"
              >
                {t("messages.tryAnotherEmail")}
              </button>
            </div>
          )}

          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-[8px] w-full mt-[20px] text-[#6B7280] hover:text-[#374151] font-medium transition-colors"
          >
            <ArrowLeft className="w-[16px] h-[16px]" />
            {t("auth.backToLogin")}
          </Link>
        </div>

        <div className="bg-white rounded-[20px] shadow-lg p-[24px]">
          <h3 className="text-[15px] font-semibold text-[#111827] mb-[16px]">
            Password Reset Process
          </h3>
          <div className="space-y-[12px]">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-[12px]">
                <div
                  className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 ${
                    emailSent && step.number === 1
                      ? "bg-green-500"
                      : "bg-[#3B82F6]"
                  }`}
                >
                  <span className="text-[13px] font-bold text-white">
                    {emailSent && step.number === 1 ? "✓" : step.number}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#374151]">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-[#9CA3AF]">
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
