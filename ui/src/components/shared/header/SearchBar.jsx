import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, X } from "lucide-react";

const SearchBar = ({ products }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addToHistory = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setSearchHistory((prev) => {
      const newHistory = [
        trimmedQuery,
        ...prev.filter((item) => item !== trimmedQuery),
      ].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (e, itemToRemove) => {
    e.stopPropagation(); // Prevent clicking the item itself
    setSearchHistory((prev) => {
      const newHistory = prev.filter((item) => item !== itemToRemove);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      addToHistory(trimmedQuery);
      navigate(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setShowSearchDropdown(false);
    }
  };

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

  const shouldShowDropdown =
    showSearchDropdown &&
    (filteredProducts.length > 0 ||
      (searchQuery.trim().length < 2 && searchHistory.length > 0));

  return (
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
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          className="w-full pl-[42px] pr-[16px] py-[10px] bg-muted/50 border border-transparent focus:border-primary/20 rounded-[12px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
        />

        {shouldShowDropdown && (
          <div className="absolute top-full left-0 right-0 mt-[8px] bg-popover rounded-[16px] shadow-xl border border-border overflow-hidden z-50">
            {searchQuery.trim().length < 2 ? (
              // Search History View
              <>
                <div className="px-[16px] py-[10px] border-b border-border">
                  <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("shop.recentSearches") || "Recent Searches"}
                  </p>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="flex items-center justify-between px-[16px] py-[10px] hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-[10px]">
                        <Search className="w-[14px] h-[14px] text-muted-foreground" />
                        <span className="text-[14px] text-foreground">
                          {item}
                        </span>
                      </div>
                      <button
                        onClick={(e) => removeFromHistory(e, item)}
                        className="p-[4px] rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        title={t("common.remove") || "Remove"}
                      >
                        <X className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : filteredProducts.length > 0 ? (
              // Product Suggestions View
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
                        addToHistory(searchQuery);
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
                    handleSearch(searchQuery);
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
  );
};

export default SearchBar;
