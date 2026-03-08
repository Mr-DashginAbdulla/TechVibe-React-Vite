import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";

const ProfileTab = ({ profileData, setProfileData, onSave, saving }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[16px] border border-border p-[24px]">
      <h2 className="text-[18px] font-semibold text-foreground mb-[24px]">
        {t("settings.profileInfo")}
      </h2>
      <form onSubmit={onSave} className="space-y-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div>
            <label className="block text-[14px] font-medium text-foreground mb-[8px]">
              {t("users.firstName")}
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              className="w-full px-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-foreground mb-[8px]">
              {t("users.lastName")}
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              className="w-full px-[16px] py-[12px] bg-secondary border border-border rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
            {t("users.email")}
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
            {t("users.phone")}
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div className="flex justify-end pt-[8px]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] disabled:opacity-50"
          >
            <Save className="w-[18px] h-[18px]" />
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
