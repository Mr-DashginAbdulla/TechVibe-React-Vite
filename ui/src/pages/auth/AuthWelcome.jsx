import { Link, Navigate } from "react-router-dom";
import { ArrowRight, User, Zap, Shield, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const AuthWelcome = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  const benefits = [
    {
      icon: Zap,
      title: t("hero.freeShipping"),
      description: t("hero.freeShippingDesc"),
    },
    {
      icon: Shield,
      title: t("hero.securePayment"),
      description: t("hero.securePaymentDesc"),
    },
    {
      icon: Award,
      title: t("hero.easyReturns"),
      description: t("hero.easyReturnsDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-[16px]">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-xl p-[40px]">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-[#111827] mb-[8px]">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-[15px] text-[#6B7280]">{t("auth.welcomeDesc")}</p>
        </div>

        <div className="space-y-[16px] mb-[32px]">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-[12px] p-[12px] bg-[#F9FAFB] rounded-[12px]"
            >
              <div className="w-[40px] h-[40px] bg-[#3B82F6]/10 rounded-[10px] flex items-center justify-center shrink-0">
                <benefit.icon className="w-[20px] h-[20px] text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">
                  {benefit.title}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-[12px] mb-[24px]">
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-[8px] w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-[14px] rounded-[12px] transition-colors"
          >
            {t("auth.signIn")}
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
          <Link
            to="/auth/register"
            className="flex items-center justify-center gap-[8px] w-full bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold py-[14px] rounded-[12px] border border-[#E5E7EB] transition-colors"
          >
            <User className="w-[18px] h-[18px]" />
            {t("auth.createAccount")}
          </Link>
        </div>

        <div className="flex items-center gap-[16px] mb-[24px]">
          <div className="flex-1 h-[px] bg-[#E5E7EB]"></div>
          <span className="text-[13px] text-[#9CA3AF]">
            {t("auth.orContinueWith")}
          </span>
          <div className="flex-1 h-[px] bg-[#E5E7EB]"></div>
        </div>

        <div className="flex items-center justify-center gap-[12px] mb-[24px]">
          <button className="w-[56px] h-[56px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
            <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
          <button className="w-[56px] h-[56px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
            <svg
              className="w-[24px] h-[24px]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </button>
          <button className="w-[56px] h-[56px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
            <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#00A4EF" d="M1 13h10v10H1z" />
              <path fill="#7FBA00" d="M13 1h10v10H13z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
          </button>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center w-full text-[14px] text-[#6B7280] hover:text-[#3B82F6] font-medium transition-colors"
        >
          {t("common.continueAsGuest")} →
        </Link>
      </div>
    </div>
  );
};

export default AuthWelcome;
