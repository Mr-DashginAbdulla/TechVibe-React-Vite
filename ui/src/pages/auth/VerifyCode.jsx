import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  RefreshCcw,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { authService } from "@/services/authService";

const VerifyCode = () => {
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

  const handleChange = (index, value) => {
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
      toast.error(err.message || t("messages.errorOccurred"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !correctCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px]">
      <Helmet>
        <title>{t("auth.resetPassword")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[440px] bg-card rounded-[24px] shadow-xl p-[40px] border border-border">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
            {isVerified ? t("profile.newPassword") : t("auth.resetPassword")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {isVerified
              ? `${t("auth.resetPassword")} for ${email}`
              : t("auth.enterVerificationCode")}
          </p>
        </div>

        {!isVerified ? (
          <>
            <div className="flex justify-center mb-[24px]">
              <div className="w-[72px] h-[72px] bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-[36px] h-[36px] text-primary" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] mb-[24px]">
              <CheckCircle className="w-[18px] h-[18px] text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-[14px] text-green-700 dark:text-green-300">
                {t("auth.passwordResetLinkSent")}
              </p>
            </div>

            <div className="mb-[24px]">
              <label className="block text-[15px] font-medium text-foreground mb-[8px]">
                {t("auth.verificationCode")}
              </label>
              <p className="text-[13px] text-muted-foreground mb-[16px]">
                {t("auth.enter6DigitCode")}
              </p>

              <div className="flex justify-center gap-[10px]">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-[48px] h-[56px] text-center text-[20px] font-semibold border border-input bg-background rounded-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyCode}
              className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors mb-[16px]"
            >
              {t("auth.verifyCode")}
              <CheckCircle className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              className="flex items-center justify-center gap-[8px] w-full text-muted-foreground hover:text-foreground font-medium py-[12px] transition-colors"
            >
              <RefreshCcw className="w-[16px] h-[16px]" />
              {t("auth.resendCode")}
            </button>
          </>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-[20px]">
            <div className="flex justify-center mb-[8px]">
              <div className="w-[72px] h-[72px] bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Lock className="w-[36px] h-[36px] text-green-600 dark:text-green-400" />
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
        )}

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-[8px] w-full mt-[16px] text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
};

export default VerifyCode;
