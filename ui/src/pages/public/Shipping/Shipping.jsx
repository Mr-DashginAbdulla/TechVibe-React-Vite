import { useTranslation } from "react-i18next";
import { Package, Clock, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Shipping() {
  const { t } = useTranslation();

  const tiers = [
    {
      name: t("shipping.standardName"),
      time: t("shipping.standardTime"),
      price: t("shipping.standardPrice"),
      note: t("shipping.standardNote"),
    },
    {
      name: t("shipping.expressName"),
      time: t("shipping.expressTime"),
      price: t("shipping.expressPrice"),
      note: t("shipping.expressNote"),
    },
    {
      name: t("shipping.overnightName"),
      time: t("shipping.overnightTime"),
      price: t("shipping.overnightPrice"),
      note: t("shipping.overnightNote"),
    },
  ];

  const highlights = [
    { icon: Package, title: t("shipping.h1Title"), desc: t("shipping.h1Desc") },
    { icon: Clock, title: t("shipping.h2Title"), desc: t("shipping.h2Desc") },
    { icon: Globe, title: t("shipping.h3Title"), desc: t("shipping.h3Desc") },
    { icon: Shield, title: t("shipping.h4Title"), desc: t("shipping.h4Desc") },
  ];

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <span className="inline-block px-[14px] py-[6px] rounded-full bg-primary/10 text-primary text-[13px] font-semibold mb-[16px]">
            {t("shipping.badge")}
          </span>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("shipping.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[560px] mx-auto">
            {t("shipping.subtitle")}
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[56px]">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="flex flex-col items-center text-center p-[24px] rounded-[20px] bg-muted border border-border"
            >
              <div className="w-[52px] h-[52px] rounded-[16px] bg-primary/10 flex items-center justify-center mb-[12px]">
                <h.icon className="w-[24px] h-[24px] text-primary" />
              </div>
              <p className="text-[14px] font-bold text-foreground mb-[6px]">
                {h.title}
              </p>
              <p className="text-[13px] text-muted-foreground leading-snug">
                {h.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Shipping Tiers Table */}
        <div className="mb-[48px]">
          <h2 className="text-[24px] font-bold text-foreground mb-[24px]">
            {t("shipping.tiersTitle")}
          </h2>
          <div className="rounded-[20px] border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-[24px] py-[14px] text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("shipping.method")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("shipping.delivery")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("shipping.cost")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[13px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    {t("shipping.notes")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background">
                {tiers.map((tier, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-[24px] py-[16px] font-semibold text-foreground">
                      {tier.name}
                    </td>
                    <td className="px-[24px] py-[16px] text-muted-foreground">
                      {tier.time}
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <span className="inline-block px-[12px] py-[4px] rounded-full bg-primary/10 text-primary text-[13px] font-semibold">
                        {tier.price}
                      </span>
                    </td>
                    <td className="px-[24px] py-[16px] text-[14px] text-muted-foreground hidden md:table-cell">
                      {tier.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-[32px] mb-[48px]">
          {["processing", "tracking", "international"].map((key) => (
            <div
              key={key}
              className="p-[32px] rounded-[20px] bg-muted border border-border"
            >
              <h3 className="text-[18px] font-bold text-foreground mb-[12px]">
                {t(`shipping.${key}Title`)}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {t(`shipping.${key}Desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-[40px] rounded-[24px] bg-primary/5 border border-primary/20">
          <p className="text-foreground font-semibold mb-[16px]">
            {t("shipping.questions")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-[8px] px-[28px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("footer.contactUs")}
          </Link>
        </div>
      </div>
    </div>
  );
}
