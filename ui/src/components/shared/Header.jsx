import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, Bell, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGetCartQuery } from "@/store/api/apiSlice";
import { useLenisContext } from "@/context/LenisProvider";
import logoLight from "@/assets/images/TechVibeLogo-LightTransparent.png";
import logoDark from "@/assets/images/TechVibeLogo-DarkTransparent.png";
import DesktopNav from "./header/DesktopNav";
import SearchBar from "./header/SearchBar";
import SettingsDropdown from "./header/SettingsDropdown";
import ProfileDropdown from "./header/ProfileDropdown";
import MobileMenu from "./header/MobileMenu";
import CartDrawer from "./CartDrawer";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { az, ru, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user } = useAuth();
  const lenis = useLenisContext();
  const navigate = useNavigate();

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const cartCount = cartItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language?.startsWith("az") ? "AZ" : i18n.language?.startsWith("ru") ? "RU" : "EN";
  const localeMap = { "AZ": az, "RU": ru, "EN": enUS };
  const currentLocale = localeMap[currentLang];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [mobileMenuOpen, lenis]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    Promise.all([
      fetch(`${API_URL}/categories`).then((res) => res.json()),
      fetch(`${API_URL}/products?_limit=1000`).then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData.data || productsData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

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

          <DesktopNav categories={categories} />

          {/* Desktop Search Bar */}
          <SearchBar
            products={products}
            className="hidden md:flex items-center flex-1 max-w-[400px] mx-[32px]"
          />

          <div className="flex items-center gap-[12px]">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-[10px] rounded-[12px] hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-[22px] h-[22px]" />
            </button>

            <div className="hidden lg:flex items-center gap-[12px]">
              <SettingsDropdown />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-[10px] rounded-[12px] hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell className="w-[22px] h-[22px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-[2px] right-[2px] w-[18px] h-[18px] bg-destructive rounded-full text-[11px] font-bold text-destructive-foreground flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-[-60px] sm:right-[-20px] md:right-0 mt-[8px] w-[320px] max-w-[calc(100vw-32px)] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] max-h-[400px] overflow-hidden flex flex-col z-50">
                  <div className="flex items-center justify-between px-[16px] pb-[8px] border-b border-border">
                    <h3 className="font-semibold text-foreground text-[14px]">Bildirişlər</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead} 
                        className="text-[12px] text-primary hover:underline flex items-center gap-[4px]"
                      >
                        <CheckCircle2 className="w-[12px] h-[12px]"/>
                        Hamısnı oxunmuş et
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
                            if (notif.relatedId) navigate(`/profile/orders/${notif.relatedId}`);
                          }}
                          className={`flex flex-col gap-[4px] p-[12px] px-[16px] cursor-pointer hover:bg-accent/50 border-b border-border/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-[8px]">
                            <span className={`text-[14px] leading-tight ${!notif.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                              {notif.title}
                            </span>
                            {!notif.read && <span className="w-[8px] h-[8px] rounded-full bg-primary shrink-0 mt-[4px]"></span>}
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

            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>

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
          <MobileMenu
            categories={categories}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden absolute top-[72px] left-0 right-0 bg-background border-b border-border p-[16px] shadow-lg animate-in slide-in-from-top-2">
            <SearchBar
              products={products}
              className="w-full"
              onSearch={() => setIsSearchOpen(false)}
            />
          </div>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
