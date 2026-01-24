import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Gift,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login: contextLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (location.state?.registered) {
      toast.success(t("messages.registerSuccess"));
      window.history.replaceState({}, document.title);
    }
  }, [location, t]);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const features = [
    {
      icon: Shield,
      title: t("auth.secureLogin"),
      description: t("auth.secureLoginDesc"),
    },
    {
      icon: Zap,
      title: t("auth.fastAccess"),
      description: t("auth.fastAccessDesc"),
    },
    {
      icon: Gift,
      title: t("auth.exclusiveRewards"),
      description: t("auth.exclusiveRewardsDesc"),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error(t("validation.emailRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const user = await authService.login(formData.email, formData.password);
      contextLogin(user);
      toast.success(t("messages.loginSuccess", { name: user.firstName }));
      navigate("/");
    } catch (err) {
      toast.error(err.message || t("messages.loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-[16px]">
      <Helmet>
        <title>{t("auth.signIn")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[900px] bg-white rounded-[24px] shadow-xl overflow-hidden flex">
        <div className="hidden lg:flex flex-col justify-center w-[380px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] p-[40px] text-white">
          <h2 className="text-[24px] font-bold mb-[24px]">
            {t("auth.welcomeBack")}
          </h2>
          <div className="space-y-[20px] mb-[32px]">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-[12px]">
                <div className="w-[40px] h-[40px] bg-white/20 rounded-[10px] flex items-center justify-center shrink-0">
                  <feature.icon className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-[13px] text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
            alt="Shopping"
            className="w-full rounded-[16px] object-cover h-[180px]"
          />
        </div>

        <div className="flex-1 p-[40px]">
          <div className="max-w-[360px] mx-auto">
            <div className="mb-[32px]">
              <h1 className="text-[28px] font-bold text-[#111827] mb-[8px]">
                {t("auth.signIn")}
              </h1>
              <p className="text-[15px] text-[#6B7280]">
                {t("auth.noAccount")}{" "}
                <Link
                  to="/auth/register"
                  className="text-[#3B82F6] font-medium hover:underline"
                >
                  {t("auth.createOne")}
                </Link>
              </p>
            </div>

            <form className="space-y-[20px]" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-[8px]">
                  <label className="text-[14px] font-medium text-[#374151]">
                    {t("auth.password")}
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-[13px] text-[#3B82F6] hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("auth.passwordPlaceholder")}
                    className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all pr-[48px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[20px] h-[20px]" />
                    ) : (
                      <Eye className="w-[20px] h-[20px]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-[8px]">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[18px] h-[18px] rounded-[4px] border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <label
                  htmlFor="remember"
                  className="text-[14px] text-[#6B7280]"
                >
                  {t("auth.rememberMe")}
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-[8px] w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#93C5FD] text-white font-semibold py-[14px] rounded-[12px] transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    {t("auth.signingIn")}
                  </>
                ) : (
                  <>
                    {t("auth.signIn")}
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-[16px] my-[24px]">
              <div className="flex-1 h-px bg-[#E5E7EB]"></div>
              <span className="text-[13px] text-[#9CA3AF]">
                {t("auth.orContinueWith")}
              </span>
              <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            </div>

            <div className="flex items-center justify-center gap-[12px]">
              <button className="flex-1 h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center gap-[8px] hover:bg-[#F9FAFB] transition-colors">
                <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24">
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
                <span className="text-[14px] font-medium text-[#374151]">
                  Google
                </span>
              </button>
              <button className="flex-1 h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] flex items-center justify-center gap-[8px] hover:bg-[#F9FAFB] transition-colors">
                <svg
                  className="w-[20px] h-[20px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-[14px] font-medium text-[#374151]">
                  Apple
                </span>
              </button>
            </div>

            <Link
              to="/"
              className="flex items-center justify-center w-full mt-[20px] text-[14px] text-[#6B7280] hover:text-[#3B82F6] font-medium transition-colors"
            >
              {t("common.continueAsGuest")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
