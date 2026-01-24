import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const { t } = useTranslation();

  return (
    <section className="py-[60px] bg-gradient-to-r from-[#3B82F6] to-[#6366F1]">
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
              <Mail className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
              <input
                type="email"
                placeholder={t("home.enterEmail")}
                className="w-full pl-[48px] pr-[16px] py-[14px] rounded-[12px] bg-white text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-[2px] focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              className="bg-[#111827] hover:bg-[#1F2937] text-white font-semibold px-[28px] py-[14px] rounded-[12px] transition-colors whitespace-nowrap"
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
