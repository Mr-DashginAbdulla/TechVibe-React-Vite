import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { motion } from "framer-motion";
import HeroSlider from "./HeroSlider";
import NewArrivals from "./components/NewArrivals";
import CategoryShowcase from "./components/CategoryShowcase";
import FeaturedProducts from "./components/FeaturedProducts";
import Newsletter from "./components/Newsletter";
import BrandCarousel from "./components/BrandCarousel";
import StoreLocation from "./components/StoreLocation";
import { ProductCardSkeleton } from "@/components/ui";

import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
          fetch(`${import.meta.env.VITE_API_URL}/products?_limit=1000`),
          fetch(`${import.meta.env.VITE_API_URL}/categories`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error("Server xətası");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        const productsList = productsData.data || productsData;
        const formattedProducts = productsList.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating,
          reviewCount: product.reviewsCount || 0,
          originalPrice: product.oldPrice,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
          category: product.category,
        }));

        setProducts(formattedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("messages.dataLoadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const newArrivals = products.filter((p) => p.isNew);
  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleAddToCart = async (productId) => {
    if (!user) {
      openAuthModal();
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
      openAuthModal();
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
        toast.info(t("productDetails.removedFromWishlist"));
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-[400px] bg-muted rounded-2xl mb-12 animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>TechVibe - {t("common.tagline")}</title>
        <meta name="description" content={t("common.description")} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSlider />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <NewArrivals
          products={newArrivals}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          wishlistItems={wishlistItems}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <BrandCarousel />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CategoryShowcase
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          wishlistItems={wishlistItems}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FeaturedProducts
          products={featuredProducts}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          wishlistItems={wishlistItems}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Newsletter />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StoreLocation />
      </motion.div>
    </>
  );
}

export default Home;
