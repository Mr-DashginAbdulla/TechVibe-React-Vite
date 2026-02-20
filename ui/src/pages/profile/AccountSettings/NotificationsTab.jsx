import { useTranslation } from "react-i18next";

const NotificationsTab = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
        {t("profile.notifications")}
      </h2>
      <p className="text-[15px] text-muted-foreground">{t("common.loading")}</p>
    </div>
  );
};

export default NotificationsTab;
