import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const { t } = useTranslation();

  return (
    <section className="py-[60px] bg-linear-to-br from-primary to-purple-600">
      <div className="container mx-auto px-[16px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[32px]">
          <div className="text-center lg:text-left">
            <h2 className="text-[28px] font-bold text-white mb-[8px]">
              {t("home.newsletter")}
            </h2>
            <p className="text-[16px] text-white/80">
              {t("home.newsletterDesc")}
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-[12px] w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[360px]">
              <Mail className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-muted-foreground" />
              <input
                type="email"
                placeholder={t("home.enterEmail")}
                className="w-full pl-[48px] pr-[16px] py-[14px] rounded-[12px] bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              className="bg-black hover:bg-black/80 text-white font-semibold px-[28px] py-[14px] rounded-[12px] transition-colors whitespace-nowrap"
            >
              {t("home.subscribe")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
