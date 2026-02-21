import { useTranslation } from "react-i18next";
import { Zap, Users, Star, Globe, Award, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: "50K+", label: t("about.statCustomers") },
    { value: "5K+", label: t("about.statProducts") },
    { value: "30+", label: t("about.statBrands") },
    { value: "4.8★", label: t("about.statRating") },
  ];

  const values = [
    { icon: Zap, title: t("about.val1Title"), desc: t("about.val1Desc") },
    { icon: Users, title: t("about.val2Title"), desc: t("about.val2Desc") },
    { icon: Star, title: t("about.val3Title"), desc: t("about.val3Desc") },
    { icon: Globe, title: t("about.val4Title"), desc: t("about.val4Desc") },
    { icon: Award, title: t("about.val5Title"), desc: t("about.val5Desc") },
    { icon: Target, title: t("about.val6Title"), desc: t("about.val6Desc") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden py-[80px] px-[16px]">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto max-w-[900px] text-center relative z-10">
          <span className="inline-block px-[14px] py-[6px] rounded-full bg-primary/10 text-primary text-[13px] font-semibold mb-[20px]">
            {t("about.badge")}
          </span>
          <h1 className="text-[48px] md:text-[60px] font-black text-foreground mb-[24px] leading-tight">
            {t("about.title")}
          </h1>
          <p className="text-[18px] text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-[56px] px-[16px] border-y border-border bg-muted">
        <div className="container mx-auto max-w-[900px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[42px] font-black text-primary mb-[8px]">
                  {stat.value}
                </p>
                <p className="text-[14px] text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="py-[72px] px-[16px]">
        <div className="container mx-auto max-w-[900px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center">
            <div>
              <h2 className="text-[32px] font-bold text-foreground mb-[20px]">
                {t("about.storyTitle")}
              </h2>
              <p className="text-[16px] text-muted-foreground leading-relaxed mb-[16px]">
                {t("about.storyP1")}
              </p>
              <p className="text-[16px] text-muted-foreground leading-relaxed">
                {t("about.storyP2")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[16px]">
              {["2020", "2021", "2023", "2026"].map((year, i) => (
                <div
                  key={year}
                  className="p-[24px] rounded-[20px] bg-muted border border-border text-center"
                >
                  <p className="text-[26px] font-black text-primary mb-[4px]">
                    {year}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {t(`about.timeline${i + 1}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-[72px] px-[16px] bg-muted">
        <div className="container mx-auto max-w-[900px]">
          <div className="text-center mb-[48px]">
            <h2 className="text-[32px] font-bold text-foreground mb-[12px]">
              {t("about.valuesTitle")}
            </h2>
            <p className="text-muted-foreground">{t("about.valuesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px]">
            {values.map((val) => (
              <div
                key={val.title}
                className="p-[28px] rounded-[20px] bg-background border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-[52px] h-[52px] rounded-[16px] bg-primary/10 flex items-center justify-center mb-[16px] group-hover:bg-primary/20 transition-colors">
                  <val.icon className="w-[24px] h-[24px] text-primary" />
                </div>
                <h3 className="text-[15px] font-bold text-foreground mb-[8px]">
                  {val.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-[72px] px-[16px] text-center">
        <div className="container mx-auto max-w-[600px]">
          <h2 className="text-[30px] font-bold text-foreground mb-[16px]">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-muted-foreground mb-[32px]">
            {t("about.ctaDesc")}
          </p>
          <div className="flex items-center justify-center gap-[16px] flex-wrap">
            <Link
              to="/shop"
              className="px-[28px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("home.shopNow")}
            </Link>
            <Link
              to="/contact"
              className="px-[28px] py-[13px] rounded-[12px] border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              {t("footer.contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
