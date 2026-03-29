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
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { az, ru, enUS } from "date-fns/locale";

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
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const langDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const currentLang = i18n.language?.startsWith("az")
    ? "AZ"
    : i18n.language?.startsWith("ru")
      ? "RU"
      : "EN";

  const localeMap = { "AZ": az, "RU": ru, "EN": enUS };
  const currentLocale = localeMap[currentLang];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
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

          <div className="relative" ref={notifDropdownRef}>
            <button 
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-[10px] rounded-[10px] hover:bg-accent transition-colors"
            >
              <Bell className="w-[22px] h-[22px] text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-[4px] right-[4px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-destructive px-[4px] text-[10px] font-bold text-white shadow-sm ring-2 ring-card">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-[-10px] sm:right-0 mt-[8px] w-[320px] max-w-[calc(100vw-32px)] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] max-h-[400px] overflow-hidden flex flex-col z-50">
                <div className="flex items-center justify-between px-[16px] pb-[8px] border-b border-border">
                  <h3 className="font-semibold text-foreground text-[14px]">Bildirişlər</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="text-[12px] text-primary hover:underline flex items-center gap-[4px]"
                    >
                      <CheckCircle2 className="w-[12px] h-[12px]"/>
                      Hamısını oxunmuş et
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-[16px] text-center text-muted-foreground text-[13px]">
                      Yeni bildiriş yoxdur
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        onClick={() => {
                          if (!notif.read) markAsRead(notif._id);
                          setNotifDropdownOpen(false);
                          if (notif.relatedId) navigate(`/orders/${notif.relatedId}`);
                        }}
                        className={`flex flex-col gap-[4px] p-[12px] px-[16px] cursor-pointer hover:bg-accent/50 border-b border-border/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-[8px]">
                          <span className={`text-[14px] leading-tight ${!notif.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                            {notif.title}
                          </span>
                          {!notif.read && <span className="w-[8px] h-[8px] rounded-full bg-primary flex-shrink-0 mt-[4px]"></span>}
                        </div>
                        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[11px] text-muted-foreground/70 mt-[2px]">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: currentLocale })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
