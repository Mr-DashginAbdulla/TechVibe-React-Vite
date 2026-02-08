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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
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
    <header className="sticky top-0 z-30 h-[72px] bg-white border-b border-[#E5E7EB] px-[24px]">
      <div className="flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center gap-[16px]">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-[10px] rounded-[10px] hover:bg-[#F3F4F6] transition-colors"
          >
            <Menu className="w-[22px] h-[22px] text-[#374151]" />
          </button>

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-[300px] pl-[42px] pr-[16px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-[12px]">
          {/* Language Switcher */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[10px] hover:bg-[#F3F4F6] transition-colors text-[14px] font-medium text-[#374151]"
            >
              <Globe className="w-[18px] h-[18px]" />
              <span>{currentLang}</span>
              <ChevronDown className="w-[14px] h-[14px]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-[8px] w-[140px] bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-[8px]">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-[#F3F4F6] ${
                    currentLang === "EN"
                      ? "text-[#3B82F6] font-medium"
                      : "text-[#374151]"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => changeLanguage("az")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-[#F3F4F6] ${
                    currentLang === "AZ"
                      ? "text-[#3B82F6] font-medium"
                      : "text-[#374151]"
                  }`}
                >
                  🇦🇿 Azərbaycan
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className={`flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] hover:bg-[#F3F4F6] ${
                    currentLang === "RU"
                      ? "text-[#3B82F6] font-medium"
                      : "text-[#374151]"
                  }`}
                >
                  🇷🇺 Русский
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-[10px] rounded-[10px] hover:bg-[#F3F4F6] transition-colors">
            <Bell className="w-[22px] h-[22px] text-[#374151]" />
            <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] bg-[#EF4444] rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-[10px] pl-[6px] pr-[14px] py-[6px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-[36px] h-[36px] rounded-full object-cover"
                />
              ) : (
                <div className="w-[36px] h-[36px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white text-[14px] font-semibold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-[14px] font-semibold text-[#111827]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  {isSuperAdmin ? t("users.superAdmin") : t("users.admin")}
                </p>
              </div>
              <ChevronDown className="w-[16px] h-[16px] text-[#6B7280]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-[8px] w-[220px] bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-[8px]">
                <div className="px-[16px] py-[10px] border-b border-[#E5E7EB]">
                  <p className="text-[14px] font-semibold text-[#111827]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[12px] text-[#6B7280]">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-[#374151] hover:bg-[#F3F4F6]"
                >
                  <Settings className="w-[16px] h-[16px]" />
                  {t("header.settings")}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-[#EF4444] hover:bg-red-50"
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
