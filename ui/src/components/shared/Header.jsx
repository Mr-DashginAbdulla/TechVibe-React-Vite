import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  Settings,
  Languages,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useGetCartQuery } from "@/store/api/productsApi";
import logoLight from "@/assets/images/TechVibeLogo-LightTransparent.png";
import logoDark from "@/assets/images/TechVibeLogo-DarkTransparent.png";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getInitials } = useAuth();
  const { theme, setTheme } = useTheme();

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const cartCount = cartItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const profileRef = useRef(null);
  const settingsRef = useRef(null);
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);

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
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    // Keep dropdown open for theme selection or close it?
    // Usually better to keep it open if it's a settings menu,
    // but for now let's leave it open as user might want to change theme too.
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1280px] mx-auto px-[16px]">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center gap-[8px]">
            <img
              src={logoLight}
              alt="TechVibe"
              className="h-[50px] dark:hidden"
            />
            <img
              src={logoDark}
              alt="TechVibe"
              className="h-[50px] hidden dark:block"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-[32px]">
            <Link
              to="/"
              className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>

            <div
              ref={categoriesRef}
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center gap-[4px] text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors">
                {t("nav.categories")}
                <ChevronDown
                  className={`w-[14px] h-[14px] transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[12px]">
                  <div className="bg-popover rounded-[16px] shadow-xl border border-border p-[24px] min-w-[600px]">
                    <div className="grid grid-cols-4 gap-[32px]">
                      {categories
                        .filter((cat) => cat.parentId === null)
                        .map((parent) => {
                          const children = categories.filter(
                            (cat) => cat.parentId === parent.id,
                          );
                          return (
                            <div key={parent.id}>
                              <Link
                                to={`/shop?category=${parent.id}`}
                                className="text-[15px] font-semibold text-foreground hover:text-primary mb-[12px] block"
                                onClick={() => setCategoriesOpen(false)}
                              >
                                {t(`categories.${parent.id}`)}
                              </Link>
                              <ul className="space-y-[8px]">
                                {children.map((child) => (
                                  <li key={child.id}>
                                    <Link
                                      to={`/shop?category=${child.id}`}
                                      className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
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
                    <div className="mt-[20px] pt-[16px] border-t border-border">
                      <Link
                        to="/shop"
                        className="flex items-center justify-center gap-[8px] text-[14px] font-medium text-primary hover:text-primary/80"
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
              className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {t("nav.deals")}
            </Link>
          </nav>

          <div
            className="hidden md:flex items-center flex-1 max-w-[400px] mx-[32px]"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
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
                className="w-full pl-[42px] pr-[16px] py-[10px] bg-muted/50 border border-transparent focus:border-primary/20 rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
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

              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-[8px] bg-popover rounded-[16px] shadow-xl border border-border overflow-hidden z-50">
                  {filteredProducts.length > 0 ? (
                    <>
                      <div className="px-[16px] py-[10px] border-b border-border">
                        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
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
                            className="flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-muted/50 transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-[48px] h-[48px] object-cover rounded-[8px]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <p className="text-[13px] text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <ArrowRight className="w-[16px] h-[16px] text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                      <Link
                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchDropdown(false);
                        }}
                        className="flex items-center justify-center gap-[8px] px-[16px] py-[12px] bg-muted/30 text-[14px] font-medium text-primary hover:bg-muted/50 border-t border-border transition-colors"
                      >
                        {t("shop.viewAllResults")}
                        <ArrowRight className="w-[14px] h-[14px]" />
                      </Link>
                    </>
                  ) : (
                    <div className="px-[16px] py-[24px] text-center">
                      <p className="text-[14px] text-muted-foreground">
                        {t("shop.noSearchResults")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-[12px]">
            {/* Combined Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                className="p-[10px] rounded-[12px] hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Settings"
              >
                <Settings className="w-[22px] h-[22px]" />
              </button>

              {settingsDropdownOpen && (
                <div className="absolute right-0 mt-[8px] w-[240px] bg-popover rounded-[16px] shadow-lg border border-border p-[8px] z-50">
                  {/* Language Section */}
                  <div className="mb-[8px] px-[8px] pt-[4px]">
                    <p className="text-[12px] font-medium text-muted-foreground mb-[8px] uppercase tracking-wider">
                      {t("common.language")}
                    </p>
                    <div className="grid grid-cols-3 gap-[4px]">
                      {["en", "az", "ru"].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => changeLanguage(lang)}
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

                  {/* Theme Section */}
                  <div className="px-[8px] pb-[4px]">
                    <p className="text-[12px] font-medium text-muted-foreground mb-[8px] uppercase tracking-wider">
                      {t("common.theme")}
                    </p>
                    <div className="grid grid-cols-3 gap-[4px]">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center justify-center gap-[4px] p-[8px] rounded-[10px] transition-all
                          ${
                            theme === "light"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-foreground hover:bg-accent"
                          }`}
                      >
                        <Sun className="w-[18px] h-[18px]" />
                        <span className="text-[11px] font-medium">
                          {t("theme.light")}
                        </span>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center justify-center gap-[4px] p-[8px] rounded-[10px] transition-all
                          ${
                            theme === "dark"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-foreground hover:bg-accent"
                          }`}
                      >
                        <Moon className="w-[18px] h-[18px]" />
                        <span className="text-[11px] font-medium">
                          {t("theme.dark")}
                        </span>
                      </button>
                      <button
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center justify-center gap-[4px] p-[8px] rounded-[10px] transition-all
                          ${
                            theme === "system"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-foreground hover:bg-accent"
                          }`}
                      >
                        <Laptop className="w-[18px] h-[18px]" />
                        <span className="text-[11px] font-medium">
                          {t("theme.system")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-[10px] rounded-[12px] hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart className="w-[22px] h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-[2px] -right-[2px] w-[18px] h-[18px] bg-primary rounded-full text-[11px] font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-[8px] pl-[4px] pr-[12px] py-[4px] rounded-[12px] hover:bg-accent transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-[36px] h-[36px] rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-[36px] h-[36px] bg-linear-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-semibold border border-border">
                      {getInitials()}
                    </div>
                  )}
                  <ChevronDown className="w-[16px] h-[16px] text-muted-foreground" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-[8px] w-[200px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] z-50">
                    <div className="px-[16px] py-[8px] border-b border-border">
                      <p className="text-[14px] font-semibold text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-foreground hover:bg-accent"
                    >
                      <User className="w-[16px] h-[16px]" />
                      {t("profile.myProfile")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-destructive hover:bg-destructive/10"
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
                className="hidden sm:flex items-center gap-[8px] px-[20px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors shadow-sm"
              >
                {t("nav.login")}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-[10px] rounded-[12px] hover:bg-accent text-foreground transition-colors"
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
          <div className="lg:hidden py-[16px] border-t border-border">
            <nav className="flex flex-col gap-[8px]">
              <Link
                to="/"
                className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
                onClick={() => setMobileMenuOpen(false)}
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
                className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.deals")}
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/auth/login"
                  className="mx-[16px] mt-[8px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
