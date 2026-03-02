import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login: contextLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (location.state?.registered) {
      toast.success(t("messages.registerSuccess"));
      window.history.replaceState({}, document.title);
    }
  }, [location, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error(t("validation.emailRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const user = await authService.login(formData.email, formData.password);
      contextLogin(user);
      toast.success(t("messages.loginSuccess", { name: user.firstName }));
      navigate("/");
    } catch (err) {
      toast.error(
        t(`serviceErrors.${err.message}`, { defaultValue: err.message }) ||
          t("messages.loginError"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoggedIn,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    formData,
    handleChange,
    handleSubmit,
  };
};
