import { useTranslation } from "react-i18next";

const PrivacyTab = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
        {t("auth.privacyPolicy")}
      </h2>
      <p className="text-[15px] text-muted-foreground">{t("common.loading")}</p>
    </div>
  );
};

export default PrivacyTab;
