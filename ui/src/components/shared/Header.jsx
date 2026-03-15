import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
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

const Header = () => {
  const { user } = useAuth();
  const lenis = useLenisContext();

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const cartCount = cartItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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
      fetch(`${API_URL}/products`).then((res) => res.json()),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
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
