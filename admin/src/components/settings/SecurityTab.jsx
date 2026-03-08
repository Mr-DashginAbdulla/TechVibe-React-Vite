import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";

const SecurityTab = ({ passwordData, setPasswordData, onSave, saving }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[16px] border border-border p-[24px]">
      <h2 className="text-[18px] font-semibold text-foreground mb-[24px]">
        {t("settings.changePassword")}
      </h2>
      <form onSubmit={onSave} className="space-y-[20px] max-w-[400px]">
        <div>
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("settings.currentPassword")}
          </label>
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            required
            className="w-full px-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("settings.newPassword")}
          </label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            required
            className="w-full px-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("settings.confirmPassword")}
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
            required
            className="w-full px-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex justify-end pt-[8px]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] disabled:opacity-50"
          >
            <Shield className="w-[18px] h-[18px]" />
            {saving ? t("common.saving") : t("settings.changePassword")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityTab;
