import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Lock, Loader2, CheckCircle } from "lucide-react";

const ResetPasswordForm = ({
  email,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-[20px]">
      <div className="flex justify-center mb-[8px]">
        <div className="w-[72px] h-[72px] bg-success/10 rounded-full flex items-center justify-center">
          <Lock className="w-[36px] h-[36px] text-success" />
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("profile.newPassword")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full px-[16px] py-[12px] pr-[44px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="w-[20px] h-[20px]" />
            ) : (
              <Eye className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("profile.confirmNewPassword")}
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            className="w-full px-[16px] py-[12px] pr-[44px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-[20px] h-[20px]" />
            ) : (
              <Eye className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
            {t("common.loading")}
          </>
        ) : (
          <>
            {t("profile.updatePassword")}
            <CheckCircle className="w-[18px] h-[18px]" />
          </>
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
