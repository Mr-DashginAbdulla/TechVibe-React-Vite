import { ArrowRight, Truck, Shield, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Truck,
      label: t("hero.freeShipping"),
      description: t("hero.freeShippingDesc"),
    },
    {
      icon: Shield,
      label: t("hero.securePayment"),
      description: t("hero.securePaymentDesc"),
    },
    {
      icon: RefreshCcw,
      label: t("hero.easyReturns"),
      description: t("hero.easyReturnsDesc"),
    },
  ];

  return (
    <section className="w-full bg-linear-to-br from-background via-muted/50 to-background py-[60px]">
      <div className="container mx-auto px-[16px]">
        <div className="flex flex-col lg:flex-row items-center gap-[40px] lg:gap-[60px]">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[42px] lg:text-[56px] font-extrabold text-foreground leading-[1.1] mb-[20px]">
              {t("hero.title1")}{" "}
              <span className="text-primary">{t("hero.title2")}</span>
              <br />
              {t("hero.title3")}
            </h1>
            <p className="text-[18px] text-muted-foreground mb-[32px] max-w-[500px] mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-[16px] justify-center lg:justify-start">
              <Link
                to="/shop"
                className="flex items-center gap-[8px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-[28px] py-[14px] rounded-[12px] transition-colors"
              >
                {t("hero.discoverNova")}
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-[8px] bg-background hover:bg-accent text-foreground font-semibold px-[28px] py-[14px] rounded-[12px] border border-border transition-colors"
              >
                {t("common.learnMore")}
              </Link>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute top-[20px] right-[20px] z-10 bg-emerald-500 text-white px-[16px] py-[10px] rounded-[12px] shadow-lg">
              <p className="text-[12px] font-medium">
                {t("hero.limitedOffer")}
              </p>
              <p className="text-[18px] font-bold">{t("hero.saveUpTo")}</p>
            </div>

            <div className="relative bg-card rounded-[24px] p-[40px] shadow-xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
                alt="Nova Series Laptop"
                className="w-full max-w-[500px] mx-auto object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-[24px] sm:gap-[48px] mt-[48px] pt-[32px] border-t border-border">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] bg-primary/10 rounded-[12px] flex items-center justify-center">
                <feature.icon className="w-[24px] h-[24px] text-primary" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  {feature.label}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
