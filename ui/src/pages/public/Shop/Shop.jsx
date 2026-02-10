import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

const FilterSidebar = ({
  categories,
  brands,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleCategoryChange = (categoryId) => {
    const current = selectedFilters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];
    onFilterChange("categories", updated);
  };

  const handleBrandChange = (brand) => {
    const current = selectedFilters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange("brands", updated);
  };

  const handlePriceChange = (type, value) => {
    onFilterChange(type, value);
  };

  const handleRatingChange = (rating) => {
    onFilterChange(
      "minRating",
      selectedFilters.minRating === rating ? null : rating,
    );
  };

  const hasActiveFilters =
    selectedFilters.categories?.length > 0 ||
    selectedFilters.brands?.length > 0 ||
    selectedFilters.minPrice ||
    selectedFilters.maxPrice ||
    selectedFilters.minRating;

  return (
    <div className={`${isMobile ? "p-[20px]" : ""}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-[24px] pb-[16px] border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">
            {t("shop.filters")}
          </h3>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-accent rounded-full text-foreground"
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full mb-[20px] py-[10px] px-[16px] text-[14px] font-medium text-primary bg-primary/10 rounded-[10px] hover:bg-primary/20 transition-colors"
        >
          {t("shop.clearFilters")}
        </button>
      )}

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("nav.categories")}
        </h4>
        <div className="space-y-[8px]">
          {categories
            .filter((cat) => cat.parentId === null)
            .map((parent) => {
              const children = categories.filter(
                (cat) => cat.parentId === parent.id,
              );
              return (
                <div key={parent.id}>
                  <label className="flex items-center gap-[10px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters.categories?.includes(parent.id) || false
                      }
                      onChange={() => handleCategoryChange(parent.id)}
                      className="w-[18px] h-[18px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {t(`categories.${parent.id}`)}
                    </span>
                  </label>
                  {children.map((child) => (
                    <label
                      key={child.id}
                      className="flex items-center gap-[10px] cursor-pointer group ml-[24px] mt-[6px]"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters.categories?.includes(child.id) ||
                          false
                        }
                        onChange={() => handleCategoryChange(child.id)}
                        className="w-[16px] h-[16px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
                      />
                      <span className="text-[13px] text-muted-foreground group-hover:text-primary transition-colors">
                        {t(`categories.${child.id}`)}
                      </span>
                    </label>
                  ))}
                </div>
              );
            })}
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.priceRange")}
        </h4>
        <div className="flex items-center gap-[8px]">
          <input
            type="number"
            placeholder={t("shop.minPrice")}
            value={selectedFilters.minPrice || ""}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-background rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder={t("shop.maxPrice")}
            value={selectedFilters.maxPrice || ""}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-[12px] py-[10px] border border-input bg-background rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.brands")}
        </h4>
        <div className="space-y-[8px] max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-[10px] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters.brands?.includes(brand) || false}
                onChange={() => handleBrandChange(brand)}
                className="w-[18px] h-[18px] rounded-[4px] border-input text-primary focus:ring-primary bg-background"
              />
              <span className="text-[14px] text-muted-foreground group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-[24px]">
        <h4 className="text-[14px] font-semibold text-foreground mb-[12px] uppercase tracking-wide">
          {t("shop.rating")}
        </h4>
        <div className="space-y-[10px]">
          {[4, 3, 2].map((rating) => {
            const isSelected = selectedFilters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary hover:bg-accent text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-[16px] h-[16px] ${
                        i < rating ? "text-amber-400" : "text-muted"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[14px] font-medium">
                  {rating}+ {t("shop.andAbove")}
                </span>
                {isSelected && (
                  <svg
                    className="w-[16px] h-[16px] ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SortDropdown = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "newest", label: t("shop.sortNewest") },
    { value: "price_asc", label: t("shop.sortPriceAsc") },
    { value: "price_desc", label: t("shop.sortPriceDesc") },
    { value: "rating", label: t("shop.sortRating") },
  ];

  const currentLabel =
    options.find((o) => o.value === value)?.label || options[0].label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[8px] px-[16px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
      >
        <span>{t("shop.sortBy")}:</span>
        <span className="text-foreground">{currentLabel}</span>
        <ChevronDown
          className={`w-[16px] h-[16px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-[8px] w-[200px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] z-20">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-[16px] py-[10px] text-left text-[14px] hover:bg-accent hover:text-accent-foreground transition-colors ${
                  value === option.value
                    ? "text-primary font-medium bg-primary/10"
                    : "text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ActiveFilters = ({ filters, categories, onRemove }) => {
  const { t } = useTranslation();
  const tags = [];

  if (filters.search) {
    tags.push({
      type: "search",
      value: filters.search,
      label: `"${filters.search}"`,
    });
  }

  filters.categories?.forEach((catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) tags.push({ type: "category", value: catId, label: cat.name });
  });

  filters.brands?.forEach((brand) => {
    tags.push({ type: "brand", value: brand, label: brand });
  });

  if (filters.minPrice) {
    tags.push({
      type: "minPrice",
      value: filters.minPrice,
      label: `Min: $${filters.minPrice}`,
    });
  }

  if (filters.maxPrice) {
    tags.push({
      type: "maxPrice",
      value: filters.maxPrice,
      label: `Max: $${filters.maxPrice}`,
    });
  }

  if (filters.minRating) {
    tags.push({
      type: "minRating",
      value: filters.minRating,
      label: `${filters.minRating}+ ⭐`,
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[8px] mb-[20px]">
      {tags.map((tag, idx) => (
        <span
          key={`${tag.type}-${idx}`}
          className="inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-primary/10 text-primary rounded-full text-[13px] font-medium"
        >
          {tag.label}
          <button
            onClick={() => onRemove(tag.type, tag.value)}
            className="hover:bg-primary/20 rounded-full p-[2px] transition-colors"
          >
            <X className="w-[14px] h-[14px]" />
          </button>
        </span>
      ))}
    </div>
  );
};

function Shop() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filters = {
    search: searchParams.get("search") || "",
    categories: searchParams.getAll("category"),
    brands: searchParams.getAll("brand"),
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("rating")
      ? parseInt(searchParams.get("rating"))
      : null,
    sort: searchParams.get("sort") || "newest",
  };

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const { data: wishlistItems = [] } = useGetWishlistQuery(user?.id, {
    skip: !user?.id,
  });
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/products"),
          fetch("http://localhost:3000/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error("Server error");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("messages.errorOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const brands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  }, [products]);
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    if (filters.categories.length > 0) {
      const expandedCategories = filters.categories.flatMap((catId) => {
        const children = categories
          .filter((c) => c.parentId === catId)
          .map((c) => c.id);
        return [catId, ...children];
      });
      result = result.filter((p) => expandedCategories.includes(p.category));
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (key === "categories") {
      newParams.delete("category");
      value.forEach((c) => newParams.append("category", c));
    } else if (key === "brands") {
      newParams.delete("brand");
      value.forEach((b) => newParams.append("brand", b));
    } else if (
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ sort: filters.sort });
  };

  const removeFilter = (type, value) => {
    if (type === "search") {
      updateFilters("search", "");
    } else if (type === "category") {
      updateFilters(
        "categories",
        filters.categories.filter((c) => c !== value),
      );
    } else if (type === "brand") {
      updateFilters(
        "brands",
        filters.brands.filter((b) => b !== value),
      );
    } else if (
      type === "minPrice" ||
      type === "maxPrice" ||
      type === "minRating"
    ) {
      updateFilters(type === "minRating" ? "rating" : type, null);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error(t("auth.signIn") + " to add items to cart");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      const existingItem = cartItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        await updateCartItem({
          id: existingItem.id,
          quantity: (existingItem.quantity || 1) + 1,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        await addToCart({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          selectedOptions: {},
        }).unwrap();
        toast.success(t("productDetails.addedToCart"));
      }
    } catch (error) {
      toast.error(t("messages.failedToAddToCart"));
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      toast.error(t("auth.signIn") + " to use wishlist");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      const existingItem = wishlistItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        await removeFromWishlist(existingItem.id).unwrap();
        toast.success(t("productDetails.removedFromWishlist"));
      } else {
        await addToWishlist({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString(),
        }).unwrap();
        toast.success(t("productDetails.addedToWishlist"));
      }
    } catch (error) {
      toast.error(t("messages.failedToUpdateWishlist"));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {filters.search
            ? `${t("shop.searchResults").replace("{{query}}", filters.search)}`
            : t("shop.title")}{" "}
          - TechVibe
        </title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border transition-colors">
          <div className="max-w-[1280px] mx-auto px-[16px] py-[24px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-muted-foreground mb-[16px]">
              <Link to="/" className="hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">
                {t("nav.shop")}
              </span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-foreground">
                  {filters.search
                    ? t("shop.searchResults").replace(
                        "{{query}}",
                        filters.search,
                      )
                    : t("shop.title")}
                </h1>
                <p className="text-[14px] text-muted-foreground mt-[4px]">
                  {t("shop.results").replace(
                    "{{count}}",
                    filteredProducts.length.toString(),
                  )}
                </p>
              </div>

              <div className="hidden md:flex items-center gap-[12px]">
                <div className="flex items-center gap-[4px] p-[4px] bg-accent/50 rounded-[8px]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-[8px] rounded-[6px] transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3X3 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-[8px] rounded-[6px] transition-all ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutList className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <SortDropdown
                  value={filters.sort}
                  onChange={(v) => updateFilters("sort", v)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-[16px] py-[32px]">
          <div className="md:hidden flex items-center justify-between mb-[20px]">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-[8px] px-[16px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] font-medium text-foreground"
            >
              <SlidersHorizontal className="w-[18px] h-[18px]" />
              {t("shop.filters")}
            </button>
            <SortDropdown
              value={filters.sort}
              onChange={(v) => updateFilters("sort", v)}
            />
          </div>

          <ActiveFilters
            filters={filters}
            categories={categories}
            onRemove={removeFilter}
          />

          <div className="flex gap-[32px]">
            <aside className="hidden md:block w-[280px] shrink-0">
              <div className="bg-card rounded-[16px] border border-border p-[24px] sticky top-[100px]">
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  selectedFilters={{
                    categories: filters.categories,
                    brands: filters.brands,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    minRating: filters.minRating,
                  }}
                  onFilterChange={updateFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </aside>

            <main className="flex-1">
              {currentProducts.length > 0 ? (
                <>
                  <div
                    className={`grid gap-[24px] ${
                      viewMode === "grid"
                        ? "grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        rating={product.rating}
                        reviewCount={product.reviewsCount || 0}
                        originalPrice={product.oldPrice}
                        isNew={product.isNew}
                        isFavorite={isInWishlist(product.id)}
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-[8px] mt-[40px]">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-border bg-card text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-[16px] h-[16px]" />
                        <span className="text-[14px] font-medium hidden sm:inline">
                          {t("shop.previousPage")}
                        </span>
                      </button>

                      <div className="flex items-center gap-[4px]">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-[36px] h-[36px] rounded-[8px] text-[14px] font-medium transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className="text-muted-foreground px-[4px]"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-border bg-card text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-[14px] font-medium hidden sm:inline">
                          {t("shop.nextPage")}
                        </span>
                        <ChevronRight className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-[60px]">
                  <p className="text-[18px] text-muted-foreground mb-[16px]">
                    {t("shop.noResults")}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
                  >
                    {t("shop.clearFilters")}
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {mobileFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-[320px] max-w-[90vw] bg-background z-50 overflow-y-auto border-r border-border">
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedFilters={{
                  categories: filters.categories,
                  brands: filters.brands,
                  minPrice: filters.minPrice,
                  maxPrice: filters.maxPrice,
                  minRating: filters.minRating,
                }}
                onFilterChange={updateFilters}
                onClearFilters={clearFilters}
                isMobile={true}
                onClose={() => setMobileFilterOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Shop;
