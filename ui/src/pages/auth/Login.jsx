import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import logoLight from "@/assets/images/TechVibeLogo-LightTransparent.png";
import logoDark from "@/assets/images/TechVibeLogo-DarkTransparent.png";
import { useLoginForm } from "./components/useLoginForm";
import LoginSidebar from "./components/LoginSidebar";
import LoginForm from "./components/LoginForm";
import SocialButtons from "./components/SocialButtons";

const Login = () => {
  const { t } = useTranslation();
  const {
    isLoggedIn,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    formData,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-[16px]">
      <Helmet>
        <title>{t("auth.signIn")} - TechVibe</title>
      </Helmet>
      <div className="w-full max-w-[900px] bg-card rounded-[24px] shadow-xl overflow-hidden flex border border-border">
        <LoginSidebar />

        <div className="flex-1 p-[40px]">
          <div className="max-w-[360px] mx-auto">
            <div className="mb-[32px]">
              <div className="flex justify-center mb-[24px]">
                <img
                  src={logoLight}
                  alt="TechVibe"
                  className="h-[40px] dark:hidden"
                />
                <img
                  src={logoDark}
                  alt="TechVibe"
                  className="h-[40px] hidden dark:block"
                />
              </div>
              <h1 className="text-[28px] font-bold text-foreground mb-[8px]">
                {t("auth.signIn")}
              </h1>
              <p className="text-[15px] text-muted-foreground">
                {t("auth.noAccount")}{" "}
                <Link
                  to="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  {t("auth.createOne")}
                </Link>
              </p>
            </div>

            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              isLoading={isLoading}
            />

            <SocialButtons />

            <Link
              to="/"
              className="flex items-center justify-center w-full mt-[20px] text-[14px] text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {t("common.continueAsGuest")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
