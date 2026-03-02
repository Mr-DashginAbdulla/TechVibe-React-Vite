import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { authService } from "@/services/authService";

export const useVerifyCode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, verificationCode: correctCode } = location.state || {};

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !correctCode) {
      toast.error(t("messages.invalidAccess"));
      navigate("/auth/forgot-password");
    }
  }, [email, correctCode, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData
        .split("")
        .concat(Array(6).fill(""))
        .slice(0, 6);
      setCode(newCode);
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      toast.error(t("auth.enter6DigitCode"));
      return;
    }
    if (enteredCode === correctCode) {
      setIsVerified(true);
      toast.success(t("auth.verificationSuccessful"));
    } else {
      toast.error(t("messages.invalidVerificationCode"));
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendCode = () => {
    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    location.state.verificationCode = newVerificationCode;
    toast.info(`🔐 Demo: Your new code is ${newVerificationCode}`, {
      autoClose: 15000,
      position: "top-center",
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error(t("validation.fillAllFields"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("validation.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("validation.passwordMismatch"));
      return;
    }
    setIsLoading(true);
    try {
      await authService.updatePassword(email, newPassword);
      toast.success(t("auth.passwordResetComplete"));
      navigate("/auth/reset-success");
    } catch (err) {
      toast.error(
        t(`serviceErrors.${err.message}`, { defaultValue: err.message }) ||
          t("messages.errorOccurred"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    correctCode,
    code,
    isVerified,
    isLoading,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    inputRefs,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleVerifyCode,
    handleResendCode,
    handleResetPassword,
  };
};
