import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useGetCartQuery } from "@/store/api/productsApi";
import logoImg from "@/assets/images/TechVibeLogo-Light.png";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getInitials } = useAuth();

  // Get cart items count
  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const cartCount = cartItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
  };

  const currentLang = i18n.language === "az" ? "AZ" : "EN";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-[16px]">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center gap-[8px]">
            <img src={logoImg} alt="TechVibe" className="h-[50px]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-[32px]">
            <Link
              to="/"
              className="text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/shop"
              className="text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors"
            >
              {t("nav.shop")}
            </Link>
            <Link
              to="/categories"
              className="text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors"
            >
              {t("nav.categories")}
            </Link>
            <Link
              to="/deals"
              className="text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors"
            >
              {t("nav.deals")}
            </Link>
          </nav>

          <div className="hidden md:flex items-center flex-1 max-w-[400px] mx-[32px]">
            <div className="relative w-full">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t("common.search") + "..."}
                className="w-full pl-[42px] pr-[16px] py-[10px] bg-[#F3F4F6] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] hover:bg-[#F3F4F6] transition-colors"
              >
                <Globe className="w-[18px] h-[18px] text-[#6B7280]" />
                <span className="text-[14px] font-medium text-[#374151]">
                  {currentLang}
                </span>
                <ChevronDown className="w-[14px] h-[14px] text-[#6B7280]" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-[8px] w-[120px] bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-[8px]">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full px-[16px] py-[8px] text-left text-[14px] hover:bg-[#F3F4F6] ${i18n.language === "en" ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("az")}
                    className={`w-full px-[16px] py-[8px] text-left text-[14px] hover:bg-[#F3F4F6] ${i18n.language === "az" ? "text-[#3B82F6] font-medium" : "text-[#374151]"}`}
                  >
                    Azərbaycan
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/profile/wishlist"
              className="relative p-[10px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
            >
              <Heart className="w-[22px] h-[22px] text-[#374151]" />
            </Link>

            <Link
              to="/basket"
              className="relative p-[10px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
            >
              <ShoppingCart className="w-[22px] h-[22px] text-[#374151]" />
              {cartCount > 0 && (
                <span className="absolute -top-[2px] -right-[2px] w-[18px] h-[18px] bg-[#3B82F6] rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-[8px] pl-[4px] pr-[12px] py-[4px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-[36px] h-[36px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[36px] h-[36px] bg-linear-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white text-[14px] font-semibold">
                      {getInitials()}
                    </div>
                  )}
                  <ChevronDown className="w-[16px] h-[16px] text-[#6B7280]" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-[8px] w-[200px] bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-[8px]">
                    <div className="px-[16px] py-[8px] border-b border-[#E5E7EB]">
                      <p className="text-[14px] font-semibold text-[#111827]">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[12px] text-[#6B7280]">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#374151] hover:bg-[#F3F4F6]"
                    >
                      <User className="w-[16px] h-[16px]" />
                      {t("profile.myProfile")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-[16px] h-[16px]" />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex items-center gap-[8px] px-[20px] py-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors"
              >
                {t("nav.login")}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-[10px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-[22px] h-[22px]" />
              ) : (
                <Menu className="w-[22px] h-[22px]" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-[16px] border-t border-[#E5E7EB]">
            <nav className="flex flex-col gap-[8px]">
              <Link
                to="/"
                className="px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/shop"
                className="px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                {t("nav.shop")}
              </Link>
              <Link
                to="/categories"
                className="px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                {t("nav.categories")}
              </Link>
              <Link
                to="/deals"
                className="px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                {t("nav.deals")}
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/auth/login"
                  className="mx-[16px] mt-[8px] py-[12px] bg-[#3B82F6] text-white font-semibold rounded-[12px] text-center"
                >
                  {t("nav.login")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
