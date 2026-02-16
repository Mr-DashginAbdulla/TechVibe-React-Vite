import { Link, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { validatePassword } from "@/utils/passwordValidation";
import FormInput from "@/components/ui/FormInput";
import PasswordInput from "@/components/ui/PasswordInput";
import SocialLoginButtons from "@/components/ui/SocialLoginButtons";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const runValidation = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = t("validation.required");
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("validation.required");
    }
    if (!formData.email.trim()) {
      errors.email = t("validation.required");
    }

    if (formData.password) {
      const result = validatePassword(formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      if (!result.isValid) {
        errors.password = result.errors.map((key) => t(`validation.${key}`));
      }
    } else {
      errors.password = [t("validation.required")];
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = [t("validation.passwordMismatch")];
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = runValidation();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!agreedToTerms) {
      toast.warning(t("validation.acceptTerms"));
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await authService.register(userData);
      toast.success(t("messages.registerSuccess"));
      navigate("/auth/login", { state: { registered: true } });
    } catch (err) {
      toast.error(err.message || t("messages.registerError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px] py-[40px]">
      <Helmet>
        <title>{t("auth.createAccount")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[480px] bg-card rounded-[24px] shadow-xl p-[40px] border border-border">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
            {t("auth.createAccount")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link
              to="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              {t("auth.signIn")}
            </Link>
          </p>
        </div>

        <form className="space-y-[20px]" onSubmit={handleSubmit}>
          <div className="flex gap-[16px]">
            <div className="flex-1">
              <FormInput
                label={t("auth.firstName")}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t("auth.firstNamePlaceholder")}
                error={fieldErrors.firstName}
              />
            </div>
            <div className="flex-1">
              <FormInput
                label={t("auth.lastName")}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t("auth.lastNamePlaceholder")}
                error={fieldErrors.lastName}
              />
            </div>
          </div>

          <FormInput
            label={t("auth.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("auth.emailPlaceholder")}
            error={fieldErrors.email}
          />

          <PasswordInput
            label={t("auth.password")}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("auth.passwordPlaceholder")}
            error={fieldErrors.password}
          />

          <PasswordInput
            label={t("auth.confirmPassword")}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            error={fieldErrors.confirmPassword}
          />

          <div className="flex items-start gap-[10px]">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-[18px] h-[18px] mt-[2px] rounded-[4px] border-input text-primary focus:ring-primary"
            />
            <label
              htmlFor="terms"
              className="text-[14px] text-muted-foreground"
            >
              {t("auth.agreeToTerms")}{" "}
              <Link to="/terms" className="text-primary hover:underline">
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("common.and")}{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                {t("auth.privacyPolicy")}
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                {t("auth.registering")}
              </>
            ) : (
              <>
                {t("auth.createAccount")}
                <ArrowRight className="w-[18px] h-[18px]" />
              </>
            )}
          </button>
        </form>

        <SocialLoginButtons />

        <Link
          to="/"
          className="flex items-center justify-center w-full mt-[20px] text-[14px] text-muted-foreground hover:text-primary font-medium transition-colors"
        >
          {t("common.continueAsGuest")} →
        </Link>
      </div>
    </div>
  );
};

export default Register;
