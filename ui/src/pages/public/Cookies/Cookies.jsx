import { useTranslation } from "react-i18next";
import { Cookie, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

export default function Cookies() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState({
    analytics: true,
    marketing: false,
    functional: true,
  });

  const cookieTypes = [
    {
      key: "essential",
      label: t("cookies.essential"),
      desc: t("cookies.essentialDesc"),
      fixed: true,
    },
    {
      key: "functional",
      label: t("cookies.functional"),
      desc: t("cookies.functionalDesc"),
      fixed: false,
    },
    {
      key: "analytics",
      label: t("cookies.analytics"),
      desc: t("cookies.analyticsDesc"),
      fixed: false,
    },
    {
      key: "marketing",
      label: t("cookies.marketing"),
      desc: t("cookies.marketingDesc"),
      fixed: false,
    },
  ];

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[800px]">
        <div className="text-center mb-[56px]">
          <div className="w-[64px] h-[64px] rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-[20px]">
            <Cookie className="w-[30px] h-[30px] text-primary" />
          </div>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("cookies.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[520px] mx-auto">
            {t("cookies.subtitle")}
          </p>
        </div>

        <div className="p-[24px] rounded-[20px] bg-muted border border-border mb-[40px]">
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {t("cookies.intro")}
          </p>
        </div>

        {/* What are cookies */}
        <section className="mb-[48px]">
          <h2 className="text-[22px] font-bold text-foreground mb-[14px]">
            {t("cookies.whatTitle")}
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {t("cookies.whatBody")}
          </p>
        </section>

        {/* Cookie types with toggles */}
        <section className="mb-[48px]">
          <h2 className="text-[22px] font-bold text-foreground mb-[24px]">
            {t("cookies.typesTitle")}
          </h2>
          <div className="flex flex-col gap-[16px]">
            {cookieTypes.map((type) => (
              <div
                key={type.key}
                className="flex items-start justify-between gap-[24px] p-[24px] rounded-[20px] bg-muted border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-[10px] mb-[6px]">
                    <p className="text-[15px] font-bold text-foreground">
                      {type.label}
                    </p>
                    {type.fixed && (
                      <span className="px-[8px] py-[2px] rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                        {t("cookies.required")}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {type.desc}
                  </p>
                </div>
                <button
                  disabled={type.fixed}
                  onClick={() =>
                    !type.fixed &&
                    setPrefs((p) => ({ ...p, [type.key]: !p[type.key] }))
                  }
                  className="shrink-0 mt-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  aria-label={type.label}
                >
                  {type.fixed || prefs[type.key] ? (
                    <ToggleRight className="w-[36px] h-[36px] text-primary" />
                  ) : (
                    <ToggleLeft className="w-[36px] h-[36px] text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* How we use */}
        <section className="mb-[48px]">
          <h2 className="text-[22px] font-bold text-foreground mb-[14px]">
            {t("cookies.howTitle")}
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {t("cookies.howBody")}
          </p>
        </section>

        <div className="p-[28px] rounded-[20px] bg-muted border border-border">
          <p className="text-[14px] text-muted-foreground">
            {t("cookies.contact")}{" "}
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
