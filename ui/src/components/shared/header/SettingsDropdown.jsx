import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const SettingsDropdown = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    { key: "light", icon: Sun, label: t("theme.light") },
    { key: "dark", icon: Moon, label: t("theme.dark") },
    { key: "system", icon: Laptop, label: t("theme.system") },
  ];

  return (
    <div className="relative" ref={settingsRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-[10px] rounded-[12px] hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        title="Settings"
      >
        <Settings className="w-[22px] h-[22px]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[8px] w-[240px] bg-popover rounded-[16px] shadow-lg border border-border p-[8px] z-50">
          <div className="mb-[8px] px-[8px] pt-[4px]">
            <p className="text-[12px] font-medium text-muted-foreground mb-[8px] uppercase tracking-wider">
              {t("common.language")}
            </p>
            <div className="grid grid-cols-3 gap-[4px]">
              {["en", "az", "ru"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-[8px] py-[6px] text-[13px] font-medium rounded-[8px] transition-all
                    ${
                      i18n.language === lang
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border my-[8px]" />

          <div className="px-[8px] pb-[4px]">
            <p className="text-[12px] font-medium text-muted-foreground mb-[8px] uppercase tracking-wider">
              {t("common.theme")}
            </p>
            <div className="grid grid-cols-3 gap-[4px]">
              {themeOptions.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex flex-col items-center justify-center gap-[4px] p-[8px] rounded-[10px] transition-all
                    ${
                      theme === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent"
                    }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
