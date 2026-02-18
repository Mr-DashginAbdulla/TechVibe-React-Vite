import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { Percent, Clock, Flame } from "lucide-react";

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

function Deals() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("discount");

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
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("messages.errorOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const dealsProducts = useMemo(() => {
    let deals = products
      .filter((p) => p.oldPrice && p.oldPrice > p.price)
      .map((p) => ({
        ...p,
        discountPercent: Math.round(
          ((p.oldPrice - p.price) / p.oldPrice) * 100,
        ),
      }));

    switch (sortBy) {
      case "discount":
        deals.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "price_asc":
        deals.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        deals.sort((a, b) => b.price - a.price);
        break;
    }

    return deals;
  }, [products, sortBy]);

  const maxDiscount = useMemo(() => {
    if (dealsProducts.length === 0) return 0;
    return Math.max(...dealsProducts.map((p) => p.discountPercent));
  }, [dealsProducts]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error(t("messages.loginToAddToCart"));
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
      toast.error(t("messages.loginToUseWishlist"));
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
        <title>{t("deals.title")} - TechVibe</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="bg-linear-to-br from-red-600 to-red-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-[1280px] mx-auto px-[16px] py-[48px] relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-[32px]">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-[8px] px-[16px] py-[8px] bg-white/20 rounded-full mb-[16px]">
                  <Flame className="w-[18px] h-[18px]" />
                  <span className="text-[14px] font-semibold">
                    {t("deals.endsSoon")}
                  </span>
                </div>
                <h1 className="text-[36px] md:text-[48px] font-bold mb-[16px]">
                  {t("deals.title")}
                </h1>
                <p className="text-[18px] text-white/80 max-w-[500px]">
                  {t("deals.subtitle")}
                </p>
              </div>

              <div className="flex items-center gap-[24px]">
                <div className="text-center px-[24px] py-[16px] bg-white/10 rounded-[16px] backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-[8px] mb-[4px]">
                    <Percent className="w-[24px] h-[24px]" />
                    <span className="text-[32px] font-bold">
                      {maxDiscount}%
                    </span>
                  </div>
                  <p className="text-[14px] text-white/80">
                    {t("deals.saveUp").replace(
                      "{{percent}}",
                      maxDiscount.toString(),
                    )}
                  </p>
                </div>
                <div className="text-center px-[24px] py-[16px] bg-white/10 rounded-[16px] backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-[8px] mb-[4px]">
                    <Clock className="w-[24px] h-[24px]" />
                    <span className="text-[32px] font-bold">
                      {dealsProducts.length}
                    </span>
                  </div>
                  <p className="text-[14px] text-white/80">{t("nav.deals")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-[16px] py-[48px]">
          <div className="flex items-center justify-between mb-[32px]">
            <p className="text-[16px] text-muted-foreground">
              {dealsProducts.length}{" "}
              {t("shop.results").replace("{{count}} ", "")}
            </p>
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-muted-foreground">
                {t("shop.sortBy")}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-[12px] py-[8px] border border-border bg-card rounded-[8px] text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="discount">{t("product.highestDiscount")}</option>
                <option value="price_asc">{t("shop.sortPriceAsc")}</option>
                <option value="price_desc">{t("shop.sortPriceDesc")}</option>
              </select>
            </div>
          </div>

          {dealsProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[24px]">
              {dealsProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-[12px] left-[12px] z-10 px-[10px] py-[4px] bg-[#DC2626] text-white text-[12px] font-bold rounded-[6px]">
                    -{product.discountPercent}%
                  </div>
                  <ProductCard
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-[60px]">
              <Percent className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[16px]" />
              <p className="text-[18px] text-muted-foreground mb-[16px]">
                {t("deals.noDeals")}
              </p>
              <Link
                to="/shop"
                className="inline-flex px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
              >
                {t("home.shopNow")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Deals;
