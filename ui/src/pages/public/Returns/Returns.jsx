import { useTranslation } from "react-i18next";
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Returns() {
  const { t } = useTranslation();

  const steps = [
    { num: "01", title: t("returns.step1Title"), desc: t("returns.step1Desc") },
    { num: "02", title: t("returns.step2Title"), desc: t("returns.step2Desc") },
    { num: "03", title: t("returns.step3Title"), desc: t("returns.step3Desc") },
    { num: "04", title: t("returns.step4Title"), desc: t("returns.step4Desc") },
  ];

  const eligible = [
    t("returns.elig1"),
    t("returns.elig2"),
    t("returns.elig3"),
    t("returns.elig4"),
  ];
  const notEligible = [
    t("returns.notElig1"),
    t("returns.notElig2"),
    t("returns.notElig3"),
  ];

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <div className="w-[64px] h-[64px] rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-[20px]">
            <RotateCcw className="w-[30px] h-[30px] text-primary" />
          </div>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("returns.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[520px] mx-auto">
            {t("returns.subtitle")}
          </p>
        </div>

        {/* 30-Day Badge */}
        <div className="flex justify-center mb-[56px]">
          <div className="inline-flex flex-col items-center gap-[8px] px-[48px] py-[32px] rounded-[24px] bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
            <span className="text-[64px] font-black text-primary leading-none">
              30
            </span>
            <span className="text-[18px] font-bold text-foreground">
              {t("returns.dayPolicy")}
            </span>
            <span className="text-[14px] text-muted-foreground">
              {t("returns.dayPolicyDesc")}
            </span>
          </div>
        </div>

        {/* Steps */}
        <h2 className="text-[24px] font-bold text-foreground mb-[28px]">
          {t("returns.howTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] mb-[48px]">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex gap-[20px] p-[28px] rounded-[20px] bg-muted border border-border"
            >
              <span className="text-[32px] font-black text-primary/20 leading-none shrink-0">
                {step.num}
              </span>
              <div>
                <p className="text-[15px] font-bold text-foreground mb-[6px]">
                  {step.title}
                </p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[48px]">
          <div className="p-[28px] rounded-[20px] bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-[10px] mb-[20px]">
              <CheckCircle className="w-[22px] h-[22px] text-green-500" />
              <h3 className="text-[17px] font-bold text-foreground">
                {t("returns.eligibleTitle")}
              </h3>
            </div>
            <ul className="flex flex-col gap-[12px]">
              {eligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[10px] text-[14px] text-muted-foreground"
                >
                  <span className="w-[6px] h-[6px] rounded-full bg-green-500 mt-[6px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-[28px] rounded-[20px] bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-[10px] mb-[20px]">
              <XCircle className="w-[22px] h-[22px] text-red-500" />
              <h3 className="text-[17px] font-bold text-foreground">
                {t("returns.notEligibleTitle")}
              </h3>
            </div>
            <ul className="flex flex-col gap-[12px]">
              {notEligible.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[10px] text-[14px] text-muted-foreground"
                >
                  <span className="w-[6px] h-[6px] rounded-full bg-red-500 mt-[6px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-[14px] p-[24px] rounded-[16px] bg-amber-500/5 border border-amber-500/20 mb-[48px]">
          <AlertCircle className="w-[22px] h-[22px] text-amber-500 shrink-0 mt-[2px]" />
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            {t("returns.refundNote")}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-[8px] px-[28px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("returns.startReturn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
