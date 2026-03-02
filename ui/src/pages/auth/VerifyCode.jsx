import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVerifyCode } from "./components/useVerifyCode";
import CodeInput from "./components/CodeInput";
import ResetPasswordForm from "./components/ResetPasswordForm";

const VerifyCode = () => {
  const { t } = useTranslation();
  const {
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
  } = useVerifyCode();

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
          <CodeInput
            code={code}
            inputRefs={inputRefs}
            onCodeChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onVerify={handleVerifyCode}
            onResend={handleResendCode}
          />
        ) : (
          <ResetPasswordForm
            email={email}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
            onSubmit={handleResetPassword}
          />
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
