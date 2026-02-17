import { useState } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

const MobileTheme = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { key: "light", icon: Sun, label: t("theme.light") },
    { key: "dark", icon: Moon, label: t("theme.dark") },
    { key: "system", icon: Laptop, label: t("theme.system") },
  ];

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
      >
        <div className="flex items-center gap-[8px]">
          <Sun className="w-[18px] h-[18px] text-muted-foreground" />
          {t("common.theme")}
        </div>
        <ChevronDown
          className={`w-[18px] h-[18px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="mx-[16px] mt-[4px] p-[4px] bg-accent/30 rounded-[8px] grid grid-cols-3 gap-[4px]">
          {themeOptions.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex items-center justify-center gap-[6px] py-[6px] rounded-[6px] transition-all
                ${
                  theme === key
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="w-[14px] h-[14px]" />
              <span className="text-[12px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileTheme;
