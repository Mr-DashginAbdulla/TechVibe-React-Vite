import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock, AlertCircle } from "lucide-react";
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center p-[24px]">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-[32px]">
          <div className="inline-flex items-center justify-center w-[64px] h-[64px] bg-white rounded-[16px] shadow-lg mb-[16px]">
            <span className="text-[32px] font-bold text-transparent bg-clip-text bg-linear-to-br from-[#3B82F6] to-[#6366F1]">
              T
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-white">
            {t("login.title")}
          </h1>
          <p className="text-[14px] text-white/80 mt-[4px]">
            {t("login.subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[20px] p-[32px] shadow-xl"
        >
          {error && (
            <div className="flex items-center gap-[10px] p-[14px] bg-red-50 border border-red-200 rounded-[12px] mb-[24px]">
              <AlertCircle className="w-[20px] h-[20px] text-red-500 shrink-0" />
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-[20px]">
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-[28px] py-[14px] bg-linear-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#2563EB] hover:to-[#4F46E5] text-white font-semibold rounded-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-[8px]">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("login.signingIn")}
              </span>
            ) : (
              t("login.signIn")
            )}
          </button>

          <p className="text-center text-[13px] text-[#6B7280] mt-[20px]">
            {t("login.accessDenied")}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
