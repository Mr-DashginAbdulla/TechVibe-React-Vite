import { useTranslation } from "react-i18next";
import { Newspaper, Download, ExternalLink } from "lucide-react";

const releases = [
  {
    date: "Feb 2026",
    title: "TechVibe Reaches 50,000 Customers Milestone",
    tag: "Company News",
  },
  {
    date: "Jan 2026",
    title: "TechVibe Launches Promo Code & Loyalty Program",
    tag: "Product Update",
  },
  {
    date: "Dec 2025",
    title: "TechVibe Expands Product Catalog to 5,000+ Items",
    tag: "Company News",
  },
  {
    date: "Oct 2025",
    title: "TechVibe Introduces Express Delivery Across Baku",
    tag: "Service Update",
  },
];

const coverage = [
  {
    outlet: "TechCrunch",
    headline: "TechVibe: Azerbaijan's Rising Tech Retail Star",
  },
  {
    outlet: "Forbes",
    headline: "The Best Online Tech Stores in the CIS Region 2026",
  },
  {
    outlet: "Wired",
    headline: "How TechVibe Is Bringing Premium Tech to the Caucasus",
  },
];

export default function Press() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <div className="w-[64px] h-[64px] rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-[20px]">
            <Newspaper className="w-[30px] h-[30px] text-primary" />
          </div>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("press.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[540px] mx-auto">
            {t("press.subtitle")}
          </p>
        </div>

        {/* Media Kit */}
        <div className="p-[32px] rounded-[24px] bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 mb-[56px] flex flex-col md:flex-row items-center justify-between gap-[24px]">
          <div>
            <h2 className="text-[20px] font-bold text-foreground mb-[8px]">
              {t("press.mediaKitTitle")}
            </h2>
            <p className="text-[14px] text-muted-foreground">
              {t("press.mediaKitDesc")}
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-[10px] px-[24px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-[18px] h-[18px]" />
            {t("press.downloadKit")}
          </a>
        </div>

        {/* Press Releases */}
        <h2 className="text-[24px] font-bold text-foreground mb-[24px]">
          {t("press.releasesTitle")}
        </h2>
        <div className="flex flex-col gap-[16px] mb-[56px]">
          {releases.map((r, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-[16px] p-[24px] rounded-[20px] bg-muted border border-border hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-[10px] mb-[8px] flex-wrap">
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {r.date}
                  </span>
                  <span className="px-[10px] py-[2px] rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    {r.tag}
                  </span>
                </div>
                <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                  {r.title}
                </p>
              </div>
              <ExternalLink className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-[2px]" />
            </div>
          ))}
        </div>

        {/* Media Coverage */}
        <h2 className="text-[24px] font-bold text-foreground mb-[24px]">
          {t("press.coverageTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mb-[56px]">
          {coverage.map((c, i) => (
            <div
              key={i}
              className="p-[24px] rounded-[20px] bg-muted border border-border text-center hover:border-primary/30 transition-all cursor-pointer group"
            >
              <p className="text-[20px] font-black text-primary mb-[12px]">
                {c.outlet}
              </p>
              <p className="text-[14px] text-muted-foreground italic leading-snug group-hover:text-foreground transition-colors">
                "{c.headline}"
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="p-[32px] rounded-[24px] bg-muted border border-border">
          <h3 className="text-[18px] font-bold text-foreground mb-[10px]">
            {t("press.contactTitle")}
          </h3>
          <p className="text-[14px] text-muted-foreground mb-[16px]">
            {t("press.contactDesc")}
          </p>
          <a
            href="mailto:press@techvibe.az"
            className="text-primary font-semibold hover:underline"
          >
            press@techvibe.az
          </a>
        </div>
      </div>
    </div>
  );
}
