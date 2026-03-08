import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const currentLang = i18n.language?.startsWith("az")
    ? "AZ"
    : i18n.language?.startsWith("ru")
      ? "RU"
      : "EN";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-[10px] pl-[6px] pr-[14px] py-[6px] rounded-[12px] hover:bg-accent transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-[36px] h-[36px] rounded-full object-cover"
                />
              ) : (
                <div className="w-[36px] h-[36px] bg-linear-to-br from-primary to-ring rounded-full flex items-center justify-center text-primary-foreground text-[14px] font-semibold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-[14px] font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {isSuperAdmin ? t("users.superAdmin") : t("users.admin")}
                </p>
              </div>
              <ChevronDown className="w-[16px] h-[16px] text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-[8px] w-[220px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px]">
                <div className="px-[16px] py-[10px] border-b border-border">
                  <p className="text-[14px] font-semibold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-foreground hover:bg-accent"
                >
                  <Settings className="w-[16px] h-[16px]" />
                  {t("header.settings")}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-[16px] h-[16px]" />
                  {t("header.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
