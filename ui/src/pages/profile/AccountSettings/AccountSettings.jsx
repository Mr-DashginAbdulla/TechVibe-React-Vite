import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import { useAccountSettings } from "@/hooks/useAccountSettings";
import SettingsHeader from "./SettingsHeader";
import SettingsTabs from "./SettingsTabs";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import NotificationsTab from "./NotificationsTab";
import PrivacyTab from "./PrivacyTab";

const AccountSettings = () => {
  const { t } = useTranslation();
  const {
    user,
    fileInputRef,
    activeTab,
    setActiveTab,
    isLoading,
    message,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    personalData,
    setPersonalData,
    passwordData,
    setPasswordData,
    tabs,
    handleAvatarChange,
    handlePersonalSubmit,
    handlePasswordSubmit,
  } = useAccountSettings();

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.accountSettings")} - TechVibe</title>
      </Helmet>

      <SettingsHeader
        user={user}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
        onAvatarChange={handleAvatarChange}
      />

      {message.text && (
        <div
          className={`p-[16px] rounded-[12px] flex items-center gap-[12px] ${
            message.type === "success"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-[20px] h-[20px]" />
          ) : null}
          {message.text}
        </div>
      )}

      <SettingsTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        {activeTab === "personal" && (
          <PersonalInfoForm
            personalData={personalData}
            setPersonalData={setPersonalData}
            isLoading={isLoading}
            onSubmit={handlePersonalSubmit}
          />
        )}

        {activeTab === "password" && (
          <ChangePasswordForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            isLoading={isLoading}
            onSubmit={handlePasswordSubmit}
          />
        )}

        {activeTab === "notifications" && <NotificationsTab />}

        {activeTab === "privacy" && <PrivacyTab />}
      </div>
    </div>
  );
};

export default AccountSettings;
