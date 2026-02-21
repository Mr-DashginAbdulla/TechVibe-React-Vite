import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-[40px]">
    <h2 className="text-[22px] font-bold text-foreground mb-[14px] flex items-center gap-[10px]">
      <span className="w-[4px] h-[22px] rounded-full bg-primary inline-block" />
      {title}
    </h2>
    <div className="text-[15px] text-muted-foreground leading-relaxed space-y-[12px] pl-[14px]">
      {children}
    </div>
  </section>
);

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[800px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <div className="w-[64px] h-[64px] rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-[20px]">
            <Shield className="w-[30px] h-[30px] text-primary" />
          </div>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("privacy.title")}
          </h1>
          <p className="text-[14px] text-muted-foreground">
            {t("privacy.lastUpdated")}: February 2026
          </p>
        </div>

        <div className="p-[12px] rounded-[14px] bg-primary/5 border border-primary/20 mb-[40px]">
          <p className="text-[14px] text-muted-foreground">
            {t("privacy.intro")}
          </p>
        </div>

        <Section title={t("privacy.s1Title")}>
          <p>{t("privacy.s1Body")}</p>
        </Section>
        <Section title={t("privacy.s2Title")}>
          <p>{t("privacy.s2Body")}</p>
        </Section>
        <Section title={t("privacy.s3Title")}>
          <p>{t("privacy.s3Body")}</p>
        </Section>
        <Section title={t("privacy.s4Title")}>
          <p>{t("privacy.s4Body")}</p>
        </Section>
        <Section title={t("privacy.s5Title")}>
          <p>{t("privacy.s5Body")}</p>
        </Section>
        <Section title={t("privacy.s6Title")}>
          <p>{t("privacy.s6Body")}</p>
        </Section>

        <div className="mt-[48px] p-[28px] rounded-[20px] bg-muted border border-border">
          <p className="text-[14px] text-muted-foreground">
            {t("privacy.contact")}{" "}
            <a
              href="mailto:privacy@techvibe.az"
              className="text-primary hover:underline"
            >
              privacy@techvibe.az
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
