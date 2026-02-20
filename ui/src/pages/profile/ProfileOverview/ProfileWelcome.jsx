import { useTranslation } from "react-i18next";

const ProfileWelcome = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <h1 className="text-[24px] font-bold text-foreground mb-[8px]">
        {t("messages.loginSuccess", { name: user?.firstName })} 👋
      </h1>
      <p className="text-[15px] text-muted-foreground">
        {t("profile.overview")}
      </p>
    </div>
  );
};

export default ProfileWelcome;
