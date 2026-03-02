import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <form className="space-y-[20px]" onSubmit={handleSubmit}>
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("auth.email")}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("auth.emailPlaceholder")}
          className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-[8px]">
          <label className="text-[14px] font-medium text-foreground">
            {t("auth.password")}
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-[13px] text-primary hover:underline"
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
            className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-[48px] text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
          className="w-[18px] h-[18px] rounded-[4px] border-input text-primary focus:ring-primary"
        />
        <label htmlFor="remember" className="text-[14px] text-muted-foreground">
          {t("auth.rememberMe")}
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
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
  );
};

export default LoginForm;
