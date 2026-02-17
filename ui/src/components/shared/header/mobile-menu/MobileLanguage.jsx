import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileLanguage = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
      >
        <div className="flex items-center gap-[8px]">
          <Globe className="w-[18px] h-[18px] text-muted-foreground" />
          {t("common.language")}
        </div>
        <ChevronDown
          className={`w-[18px] h-[18px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="mx-[16px] mt-[4px] p-[4px] bg-accent/30 rounded-[8px] flex gap-[4px]">
          {["en", "az", "ru"].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={`flex-1 py-[6px] text-[13px] font-medium rounded-[6px] transition-all uppercase
                ${
                  i18n.language === lang
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileLanguage;
