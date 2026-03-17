import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Loader2 } from "lucide-react";
import { showToast as toast } from "@/components/shared/StyledToast";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import logoLight from "@/assets/images/TechVibeLogo-LightTransparent.png";
import logoDark from "@/assets/images/TechVibeLogo-DarkTransparent.png";
import FormInput from "@/components/ui/FormInput";

const VerifyOTP = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error(t("messages.emailRequired"));
      navigate("/auth/register");
    }
  }, [email, navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.warning(t("validation.invalidOtpLength", "Please enter 6-digit OTP"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(email, otpCode);
      login(response); // Logs the user in with proper token
      toast.success(t("messages.verifyOtpSuccess", "Account verified successfully!"));
      navigate("/"); // Or to dashboard
    } catch (err) {
      toast.error(err.message || t("messages.verifyOtpError", "Verification failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      toast.success(t("messages.resendOtpSuccess", "New OTP sent to your email."));
    } catch (err) {
      toast.error(err.message || t("messages.resendOtpError", "Failed to resend OTP."));
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px] py-[40px]">
      <Helmet>
        <title>{t("auth.verifyOtp", "Verify Account")} - TechVibe</title>
      </Helmet>
      
      <div className="w-full max-w-[480px] bg-card rounded-[24px] shadow-xl p-[40px] border border-border">
        <div className="text-center mb-[32px]">
          <div className="flex justify-center mb-[24px]">
             <img src={logoLight} alt="TechVibe" className="h-[40px] dark:hidden" />
             <img src={logoDark} alt="TechVibe" className="h-[40px] hidden dark:block" />
          </div>
          <div className="mx-auto w-[64px] h-[64px] bg-primary/10 text-primary rounded-full flex items-center justify-center mb-[16px]">
            <ShieldCheck className="w-[32px] h-[32px]" />
          </div>
          <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
            {t("auth.verifyAccount", "Verify Account")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {t("auth.enterOtpMsg", "We have sent a verification code to ")} 
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[24px]">
            <FormInput
                label={t("auth.otpCode", "Verification Code")}
                name="otpCode"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                placeholder="123456"
                maxLength={6}
                className="text-center text-[24px] tracking-[0.5em] font-mono h-[60px]"
            />

          <button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                {t("common.verifying", "Verifying...")}
              </>
            ) : (
              t("common.verify", "Verify")
            )}
          </button>
        </form>

        <div className="mt-[24px] text-center">
            <p className="text-[14px] text-muted-foreground">
              {t("auth.didNotReceiveCode", "Didn't receive the code?")}{" "}
              <button 
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                  {isResending ? t("common.sending", "Sending...") : t("auth.resendCode", "Resend Code")}
              </button>
            </p>
        </div>

        <Link
          to="/auth/login"
          className="flex items-center justify-center w-full mt-[20px] text-[14px] text-muted-foreground hover:text-primary font-medium transition-colors"
        >
          ← {t("auth.backToLogin", "Back to Login")}
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;
