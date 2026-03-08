import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const errorMessages = {
        USER_NOT_FOUND: t("login.errors.userNotFound"),
        WRONG_PASSWORD: t("login.errors.wrongPassword"),
        UNAUTHORIZED_ROLE: t("login.errors.unauthorizedRole"),
      };
      setError(errorMessages[err.message] || t("login.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-linear-to-br from-[#1E3A5F] via-[#2563EB] to-[#7C3AED] relative overflow-hidden flex-col items-center justify-center p-[48px]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[15%] right-[5%] w-[250px] h-[250px] bg-white/5 rounded-full blur-[60px]" />
          <div className="absolute top-[60%] left-[30%] w-[150px] h-[150px] bg-white/10 rounded-full blur-[40px]" />
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-[32px]">
            <div className="inline-flex items-center justify-center w-[80px] h-[80px] bg-white/15 rounded-[24px] backdrop-blur-sm mb-[16px]">
              <ShieldCheck className="w-[40px] h-[40px] text-white" />
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-white mb-[12px] tracking-tight">
            TechVibe
          </h1>
          <p className="text-[14px] text-white/60 font-medium uppercase tracking-[3px] mb-[40px]">
            Admin Panel
          </p>

          {/* Features */}
          <div className="space-y-[20px] text-left max-w-[320px]">
            <div className="flex items-start gap-[14px] p-[16px] bg-white/10 rounded-[16px] backdrop-blur-sm">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-white/15 flex items-center justify-center shrink-0">
                <Zap className="w-[20px] h-[20px] text-yellow-300" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">
                  {t("login.featureTitle1") || "Real-time Dashboard"}
                </p>
                <p className="text-[12px] text-white/60 mt-[2px]">
                  {t("login.featureDesc1") ||
                    "Monitor sales, orders and analytics"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-[14px] p-[16px] bg-white/10 rounded-[16px] backdrop-blur-sm">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-white/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-[20px] h-[20px] text-emerald-300" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">
                  {t("login.featureTitle2") || "Secure Access"}
                </p>
                <p className="text-[12px] text-white/60 mt-[2px]">
                  {t("login.featureDesc2") || "Role-based admin authentication"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-[24px] bg-[#F8FAFC]">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-[32px]">
            <div className="inline-flex items-center justify-center w-[56px] h-[56px] bg-linear-to-br from-[#2563EB] to-[#7C3AED] rounded-[16px] mb-[12px]">
              <ShieldCheck className="w-[28px] h-[28px] text-white" />
            </div>
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              TechVibe Admin
            </h1>
          </div>

          <div className="mb-[32px]">
            <h2 className="text-[28px] font-bold text-[#0F172A] mb-[8px]">
              {t("login.title")}
            </h2>
            <p className="text-[15px] text-[#64748B]">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {error && (
              <div className="flex items-center gap-[10px] p-[14px] bg-red-50 border border-red-200 rounded-[12px]">
                <AlertCircle className="w-[18px] h-[18px] text-red-500 shrink-0" />
                <p className="text-[13px] text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[16px] py-[13px] bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94A3B8]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[16px] py-[13px] bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[14px] bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white font-semibold rounded-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-[8px]">
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  {t("login.signingIn")}
                </span>
              ) : (
                t("login.signIn")
              )}
            </button>

            <p className="text-center text-[12px] text-[#94A3B8] mt-[16px]">
              {t("login.accessDenied")}
            </p>
          </form>

          <div className="mt-[40px] pt-[24px] border-t border-[#E2E8F0]">
            <p className="text-center text-[12px] text-[#94A3B8]">
              © 2026 TechVibe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
