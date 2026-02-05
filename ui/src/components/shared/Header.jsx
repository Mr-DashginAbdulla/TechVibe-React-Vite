import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useGetCartQuery } from "@/store/api/productsApi";
import logoImg from "@/assets/images/TechVibeLogo-Light.png";
import CartDrawer from "./CartDrawer";

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const profileRef = useRef(null);
  const langRef = useRef(null);
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch categories for mega menu and products for search
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/categories").then((res) => res.json()),
      fetch("http://localhost:3000/products").then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search query
  const filteredProducts =
    searchQuery.trim().length >= 2
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

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

            {/* Categories Mega Menu */}
            <div
              ref={categoriesRef}
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center gap-[4px] text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors">
                {t("nav.categories")}
                <ChevronDown
                  className={`w-[14px] h-[14px] transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[12px]">
                  <div className="bg-white rounded-[16px] shadow-xl border border-[#E5E7EB] p-[24px] min-w-[600px]">
                    <div className="grid grid-cols-4 gap-[32px]">
                      {/* Get only parent categories */}
                      {categories
                        .filter((cat) => cat.parentId === null)
                        .map((parent) => {
                          // Get children of this parent
                          const children = categories.filter(
                            (cat) => cat.parentId === parent.id,
                          );
                          return (
                            <div key={parent.id}>
                              <Link
                                to={`/shop?category=${parent.id}`}
                                className="text-[15px] font-semibold text-[#111827] hover:text-[#3B82F6] mb-[12px] block"
                                onClick={() => setCategoriesOpen(false)}
                              >
                                {t(`categories.${parent.id}`)}
                              </Link>
                              <ul className="space-y-[8px]">
                                {children.map((child) => (
                                  <li key={child.id}>
                                    <Link
                                      to={`/shop?category=${child.id}`}
                                      className="text-[14px] text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                                      onClick={() => setCategoriesOpen(false)}
                                    >
                                      {t(`categories.${child.id}`)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-[20px] pt-[16px] border-t border-[#E5E7EB]">
                      <Link
                        to="/shop"
                        className="flex items-center justify-center gap-[8px] text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB]"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {t("home.viewAll")}
                        <ArrowRight className="w-[16px] h-[16px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/deals"
              className="text-[15px] font-medium text-[#374151] hover:text-[#3B82F6] transition-colors"
            >
              {t("nav.deals")}
            </Link>
          </nav>

          <div
            className="hidden md:flex items-center flex-1 max-w-[400px] mx-[32px]"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t("common.search") + "..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.trim().length >= 2);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSearchDropdown(true);
                  }
                }}
                className="w-full pl-[42px] pr-[16px] py-[10px] bg-[#F3F4F6] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(
                      `/shop?search=${encodeURIComponent(searchQuery.trim())}`,
                    );
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                  }
                }}
              />

              {/* Search Suggestions Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-[8px] bg-white rounded-[16px] shadow-xl border border-[#E5E7EB] overflow-hidden z-50">
                  {filteredProducts.length > 0 ? (
                    <>
                      <div className="px-[16px] py-[10px] border-b border-[#E5E7EB]">
                        <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          {t("shop.searchSuggestions")}
                        </p>
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => {
                              setSearchQuery("");
                              setShowSearchDropdown(false);
                            }}
                            className="flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#F3F4F6] transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-[48px] h-[48px] object-cover rounded-[8px]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium text-[#111827] truncate">
                                {product.name}
                              </p>
                              <p className="text-[13px] text-[#6B7280]">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <ArrowRight className="w-[16px] h-[16px] text-[#9CA3AF]" />
                          </Link>
                        ))}
                      </div>
                      <Link
                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchDropdown(false);
                        }}
                        className="flex items-center justify-center gap-[8px] px-[16px] py-[12px] bg-[#F9FAFB] text-[14px] font-medium text-[#3B82F6] hover:bg-[#EFF6FF] border-t border-[#E5E7EB] transition-colors"
                      >
                        {t("shop.viewAllResults")}
                        <ArrowRight className="w-[14px] h-[14px]" />
                      </Link>
                    </>
                  ) : (
                    <div className="px-[16px] py-[24px] text-center">
                      <p className="text-[14px] text-[#6B7280]">
                        {t("shop.noSearchResults")}
                      </p>
                    </div>
                  )}
                </div>
              )}
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

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-[10px] rounded-[12px] hover:bg-[#F3F4F6] transition-colors"
            >
              <ShoppingCart className="w-[22px] h-[22px] text-[#374151]" />
              {cartCount > 0 && (
                <span className="absolute -top-[2px] -right-[2px] w-[18px] h-[18px] bg-[#3B82F6] rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

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
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>

              {/* Mobile Categories Accordion */}
              <div>
                <button
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
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
                        className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#F3F4F6] rounded-[8px]"
                        onClick={() => {
                          setMobileMenuOpen(false);
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
                className="px-[16px] py-[12px] text-[15px] font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-[8px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.deals")}
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/auth/login"
                  className="mx-[16px] mt-[8px] py-[12px] bg-[#3B82F6] text-white font-semibold rounded-[12px] text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
