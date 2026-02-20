import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ChangePasswordForm = ({
  passwordData,
  setPasswordData,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-[20px] max-w-[400px]">
      <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
        {t("profile.changePassword")}
      </h2>
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("profile.currentPassword")}
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary pr-[48px] text-foreground"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showCurrentPassword ? (
              <EyeOff className="w-[20px] h-[20px]" />
            ) : (
              <Eye className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("profile.newPassword")}
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary pr-[48px] text-foreground"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showNewPassword ? (
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
        <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-[8px] px-[24px] py-[14px] bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {isLoading && <Loader2 className="w-[18px] h-[18px] animate-spin" />}
        {t("profile.updatePassword")}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
