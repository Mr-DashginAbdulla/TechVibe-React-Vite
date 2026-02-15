import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";

const Settings = () => {
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(user.id, profileData);
      toast.success(t("settings.profileUpdated"));
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("settings.passwordMismatch"));
      return;
    }
    setSaving(true);
    try {
      await userService.update(user.id, { password: passwordData.newPassword });
      toast.success(t("settings.passwordUpdated"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-[24px]">
      <div>
        <h1 className="text-[24px] font-bold text-[#111827]">
          {t("settings.title")}
        </h1>
        <p className="text-[14px] text-[#6B7280] mt-[4px]">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[24px]">
        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          isSuperAdmin={isSuperAdmin}
        />

        <div className="flex-1">
          {activeTab === "profile" && (
            <ProfileTab
              profileData={profileData}
              setProfileData={setProfileData}
              onSave={handleProfileSave}
              saving={saving}
            />
          )}
          {activeTab === "security" && (
            <SecurityTab
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              onSave={handlePasswordSave}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
