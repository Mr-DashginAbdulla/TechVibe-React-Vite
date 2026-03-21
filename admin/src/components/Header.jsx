import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Coins,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";

const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currency, changeCurrency, symbols } = useCurrency();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const langDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  const currentLang = i18n.language?.startsWith("az")
    ? "AZ"
    : i18n.language?.startsWith("ru")
      ? "RU"
      : "EN";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target)
      ) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-card border-b border-border px-[24px]">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-[16px]">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-[10px] rounded-[10px] hover:bg-accent transition-colors"
          >
            <Menu className="w-[22px] h-[22px] text-foreground" />
          </button>

          <div className="hidden md:block relative">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-[300px] pl-[42px] pr-[16px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-[12px]">
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[10px] hover:bg-accent transition-colors text-[14px] font-medium text-foreground"
            >
              <Globe className="w-[18px] h-[18px]" />
              <span>{currentLang}</span>
              <ChevronDown className="w-[14px] h-[14px]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-[8px] w-[140px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px]">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-accent ${
                    currentLang === "EN"
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => changeLanguage("az")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-accent ${
                    currentLang === "AZ"
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  🇦🇿 Azərbaycan
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-accent ${
                    currentLang === "RU"
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  🇷🇺 Русский
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={currencyDropdownRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[10px] hover:bg-accent transition-colors text-[14px] font-medium text-foreground"
            >
              <Coins className="w-[18px] h-[18px]" />
              <span>{symbols[currency]} {currency}</span>
              <ChevronDown className="w-[14px] h-[14px]" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-[8px] w-[140px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] z-50">
                {["AZN", "USD", "EUR"].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      changeCurrency(cur);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-accent ${
                      currency === cur
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {symbols[cur]} {cur}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-[10px] rounded-[10px] hover:bg-accent transition-colors"
            title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-[22px] h-[22px] text-foreground" />
            ) : (
              <Moon className="w-[22px] h-[22px] text-foreground" />
            )}
          </button>

          <button className="relative p-[10px] rounded-[10px] hover:bg-accent transition-colors">
            <Bell className="w-[22px] h-[22px] text-foreground" />
            <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-destructive rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
