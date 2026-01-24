import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { compressImage } from "@/utils/imageUtils";
import {
  Camera,
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from "lucide-react";

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [personalData, setPersonalData] = useState({
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

  const tabs = [
    { key: "personal", label: t("profile.personalInfo"), icon: User },
    { key: "password", label: t("profile.changePassword"), icon: Lock },
    { key: "notifications", label: t("profile.notifications"), icon: Bell },
    { key: "privacy", label: t("auth.privacyPolicy"), icon: Shield },
  ];

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const compressedBase64 = await compressImage(file, 200, 0.7);
      const updatedUser = await userService.updateAvatar(
        user.id,
        compressedBase64,
      );
      login(updatedUser);
      setMessage({ type: "success", text: t("messages.changesSaved") });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const updatedUser = await userService.updateProfile(
        user.id,
        personalData,
      );
      login(updatedUser);
      setMessage({ type: "success", text: t("messages.changesSaved") });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: t("validation.passwordMismatch") });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: t("validation.passwordMinLength") });
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      setMessage({ type: "success", text: t("messages.changesSaved") });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.accountSettings")} - TechVibe</title>
      </Helmet>

      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
        <div className="flex items-center gap-[20px]">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-[80px] h-[80px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[80px] h-[80px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center">
                <span className="text-[28px] font-bold text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[#3B82F6] rounded-full flex items-center justify-center text-white hover:bg-[#2563EB] transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-[16px] h-[16px] animate-spin" />
              ) : (
                <Camera className="w-[16px] h-[16px]" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#111827]">
              {t("profile.accountSettings")}
            </h1>
            <p className="text-[15px] text-[#6B7280]">
              {t("profile.personalInfo")}
            </p>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-[16px] rounded-[12px] flex items-center gap-[12px] ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-[20px] h-[20px]" />
          ) : null}
          {message.text}
        </div>
      )}

      <div className="flex gap-[8px] flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-[8px] px-[16px] py-[12px] rounded-[12px] text-[14px] font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#3B82F6] text-white"
                : "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]"
            }`}
          >
            <tab.icon className="w-[18px] h-[18px]" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
        {activeTab === "personal" && (
          <form onSubmit={handlePersonalSubmit} className="space-y-[20px]">
            <h2 className="text-[18px] font-semibold text-[#111827] mb-[20px]">
              {t("profile.personalInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("auth.firstName")}
                </label>
                <input
                  type="text"
                  value={personalData.firstName}
                  onChange={(e) =>
                    setPersonalData({
                      ...personalData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("auth.lastName")}
                </label>
                <input
                  type="text"
                  value={personalData.lastName}
                  onChange={(e) =>
                    setPersonalData({
                      ...personalData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                Email
              </label>
              <input
                type="email"
                value={personalData.email}
                onChange={(e) =>
                  setPersonalData({ ...personalData, email: e.target.value })
                }
                className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                required
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("profile.phone")}
              </label>
              <input
                type="tel"
                value={personalData.phone}
                onChange={(e) =>
                  setPersonalData({ ...personalData, phone: e.target.value })
                }
                placeholder="+994XXXXXXXXX"
                className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-[8px] px-[24px] py-[14px] bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#93C5FD] text-white font-semibold rounded-[12px] transition-colors"
            >
              {isLoading && (
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
              )}
              {t("common.saveChanges")}
            </button>
          </form>
        )}

        {activeTab === "password" && (
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-[20px] max-w-[400px]"
          >
            <h2 className="text-[18px] font-semibold text-[#111827] mb-[20px]">
              {t("profile.changePassword")}
            </h2>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
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
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-[48px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9CA3AF]"
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
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
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
                  className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-[48px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9CA3AF]"
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
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
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
                className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-[8px] px-[24px] py-[14px] bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#93C5FD] text-white font-semibold rounded-[12px] transition-colors"
            >
              {isLoading && (
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
              )}
              {t("profile.updatePassword")}
            </button>
          </form>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-[18px] font-semibold text-[#111827] mb-[20px]">
              {t("profile.notifications")}
            </h2>
            <p className="text-[15px] text-[#6B7280]">{t("common.loading")}</p>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <h2 className="text-[18px] font-semibold text-[#111827] mb-[20px]">
              {t("auth.privacyPolicy")}
            </h2>
            <p className="text-[15px] text-[#6B7280]">{t("common.loading")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
