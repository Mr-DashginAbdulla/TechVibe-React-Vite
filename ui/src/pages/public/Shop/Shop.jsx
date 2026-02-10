import { useState, useEffect, useMemo } from "react";

import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./components/FilterSidebar";
import ActiveFilters from "./components/ActiveFilters";
import MobileFilter from "./components/MobileFilter";
import Pagination from "./components/Pagination";
import ShopHeader from "./components/ShopHeader";
import ProductGrid from "./components/ProductGrid";
import SortDropdown from "./components/SortDropdown";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

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
        <ShopHeader
          searchQuery={filters.search}
          totalResults={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortValue={filters.sort}
          onSortChange={(v) => updateFilters("sort", v)}
        />

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
              <ProductGrid
                products={currentProducts}
                viewMode={viewMode}
                isInWishlist={isInWishlist}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                onClearFilters={clearFilters}
              />
              {currentProducts.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </main>
          </div>
        </div>

        <MobileFilter
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          categories={categories}
          brands={brands}
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />
      </div>
    </>
  );
}

export default Shop;
