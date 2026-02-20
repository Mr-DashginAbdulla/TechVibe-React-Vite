import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { compressImage } from "@/utils/imageUtils";
import { User, Lock, Bell, Shield } from "lucide-react";

export const useAccountSettings = () => {
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

  return {
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
  };
};
