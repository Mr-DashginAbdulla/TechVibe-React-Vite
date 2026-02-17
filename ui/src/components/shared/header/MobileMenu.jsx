import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const MobileMenu = ({ categories, onClose }) => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user, logout, getInitials } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const themeOptions = [
    { key: "light", icon: Sun, label: t("theme.light") },
    { key: "dark", icon: Moon, label: t("theme.dark") },
    { key: "system", icon: Laptop, label: t("theme.system") },
  ];

  return (
    <div
      className="lg:hidden py-[16px] border-t border-border max-h-[calc(100vh-72px)] overflow-y-auto"
      style={{ overscrollBehavior: "contain", scrollBehavior: "smooth" }}
      onWheel={(e) => e.stopPropagation()}
    >
      <nav className="flex flex-col gap-[8px]">
        {/* User Profile Section */}
        {isLoggedIn && (
          <div className="mx-[16px] mb-[16px] p-[16px] bg-accent/50 rounded-[16px] border border-border">
            <div className="flex items-center gap-[12px] mb-[12px]">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-[48px] h-[48px] rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-[48px] h-[48px] bg-linear-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-[18px] font-semibold border border-border">
                  {getInitials()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[14px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[8px]">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center justify-center gap-[8px] px-[12px] py-[8px] bg-background text-[14px] font-medium text-foreground rounded-[8px] border border-border shadow-sm"
              >
                <User className="w-[16px] h-[16px]" />
                {t("profile.myProfile")}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-[8px] px-[12px] py-[8px] bg-destructive/10 text-[14px] font-medium text-destructive rounded-[8px] border border-transparent hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="w-[16px] h-[16px]" />
                {t("nav.logout")}
              </button>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.home")}
        </Link>

        <div>
          <button
            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          >
            {t("nav.categories")}
            <ChevronDown
              className={`w-[18px] h-[18px] transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileCategoriesOpen && (
            <div className="ml-[16px] mt-[4px] flex flex-col gap-[4px]">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-muted-foreground hover:text-primary hover:bg-accent rounded-[8px]"
                  onClick={() => {
                    onClose();
                    setMobileCategoriesOpen(false);
                  }}
                >
                  <img
                    src={category.image}
                    alt=""
                    className="w-[32px] h-[32px] rounded-[6px] object-cover"
                  />
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/deals"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.deals")}
        </Link>

        {/* Language Selection */}
        <div>
          <button
            onClick={() => setMobileLanguageOpen(!mobileLanguageOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          >
            <div className="flex items-center gap-[8px]">
              <Globe className="w-[18px] h-[18px] text-muted-foreground" />
              {t("common.language")}
            </div>
            <ChevronDown
              className={`w-[18px] h-[18px] transition-transform ${mobileLanguageOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileLanguageOpen && (
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

        {/* Theme Selection */}
        <div>
          <button
            onClick={() => setMobileThemeOpen(!mobileThemeOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          >
            <div className="flex items-center gap-[8px]">
              <Sun className="w-[18px] h-[18px] text-muted-foreground" />
              {t("common.theme")}
            </div>
            <ChevronDown
              className={`w-[18px] h-[18px] transition-transform ${mobileThemeOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileThemeOpen && (
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

        {!isLoggedIn && (
          <Link
            to="/auth"
            className="mx-[16px] mt-[8px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] text-center"
            onClick={onClose}
          >
            {t("nav.login")}
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
