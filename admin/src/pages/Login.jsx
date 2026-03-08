import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  BarChart3,
  ShieldCheck,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LogoLight from "@/assets/images/TechVibeLogo-LightTransparent.png";
import LogoDark from "@/assets/images/TechVibeLogo-DarkTransparent.png";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative overflow-hidden flex-col items-center justify-center p-[48px]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#7c3aed]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#60a5fa] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#a78bfa] rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-[#38bdf8] rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-[24px]">
            <img
              src={LogoDark}
              alt="TechVibe"
              className="w-[180px] mx-auto drop-shadow-2xl"
            />
          </div>

          <p className="text-[13px] text-white/50 font-semibold uppercase tracking-[4px] mb-[48px]">
            {t("login.adminPanel")}
          </p>

          {/* Features */}
          <div className="space-y-[14px] text-left max-w-[340px]">
            {[
              {
                icon: <BarChart3 className="w-[20px] h-[20px] text-sky-300" />,
                title: t("login.featureTitle1"),
                desc: t("login.featureDesc1"),
              },
              {
                icon: (
                  <ShieldCheck className="w-[20px] h-[20px] text-emerald-300" />
                ),
                title: t("login.featureTitle2"),
                desc: t("login.featureDesc2"),
              },
              {
                icon: <Package className="w-[20px] h-[20px] text-violet-300" />,
                title: t("login.featureTitle3"),
                desc: t("login.featureDesc3"),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-[14px] p-[14px] bg-white/8 rounded-[14px] backdrop-blur-md border border-white/6 hover:bg-white/12 transition-colors"
              >
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white/10 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {f.title}
                  </p>
                  <p className="text-[11px] text-white/50 mt-[2px] leading-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="absolute bottom-[24px] left-0 right-0 text-center">
          <p className="text-[11px] text-white/30">
            © 2026 TechVibe. {t("login.allRightsReserved")}
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-[24px] bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-[36px]">
            <img
              src={LogoLight}
              alt="TechVibe"
              className="w-[120px] mx-auto mb-[8px] dark:hidden"
            />
            <img
              src={LogoDark}
              alt="TechVibe"
              className="w-[120px] mx-auto mb-[8px] hidden dark:block"
            />
            <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-[3px]">
              {t("login.adminPanel")}
            </p>
          </div>

          <div className="mb-[28px]">
            <h2 className="text-[26px] font-bold text-foreground mb-[6px]">
              {t("login.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground">
              {t("login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[18px]">
            {error && (
              <div className="flex items-center gap-[10px] p-[12px] bg-destructive/10 border border-destructive/20 rounded-[12px]">
                <AlertCircle className="w-[18px] h-[18px] text-destructive shrink-0" />
                <p className="text-[13px] text-destructive">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-[6px]">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-[6px]">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  required
                  className="w-full pl-[44px] pr-[44px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 p-[4px] rounded-[6px] hover:bg-accent transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[16px] h-[16px] text-muted-foreground" />
                  ) : (
                    <Eye className="w-[16px] h-[16px] text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[13px] bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white font-semibold rounded-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
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

            <p className="text-center text-[12px] text-muted-foreground mt-[12px]">
              {t("login.accessDenied")}
            </p>
          </form>

          <div className="mt-[36px] pt-[20px] border-t border-border">
            <p className="text-center text-[11px] text-muted-foreground">
              © 2026 TechVibe. {t("login.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
