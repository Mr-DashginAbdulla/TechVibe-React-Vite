import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import NewArrivals from "./components/NewArrivals";
import ShopByCategory from "./components/ShopByCategory";
import FeaturedProducts from "./components/FeaturedProducts";
import Newsletter from "./components/Newsletter";
import { ProductCardSkeleton } from "@/components/ui";

import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // RTK Query hooks for cart
  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  // RTK Query hooks for wishlist
  const { data: wishlistItems = [] } = useGetWishlistQuery(user?.id, {
    skip: !user?.id,
  });

  // Mutations
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
          throw new Error("Server xətası");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        const formattedProducts = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          rating: product.rating,
          reviewCount: product.reviewsCount || 0,
          originalPrice: product.oldPrice,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        }));

        setProducts(formattedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Məlumatlar yüklənərkən xəta baş verdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrləmə
  const newArrivals = products.filter((p) => p.isNew);
  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error(t("auth.signIn") + " to add items to cart");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      // Check if product already exists in cart
      const existingItem = cartItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        // Update quantity
        await updateCartItem({
          id: existingItem.id,
          quantity: (existingItem.quantity || 1) + 1,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        // Add new item
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
      toast.error("Failed to add to cart");
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
      // Check if already in wishlist
      const existingItem = wishlistItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        // Remove from wishlist
        await removeFromWishlist(existingItem.id).unwrap();
        toast.success(t("productDetails.removedFromWishlist"));
      } else {
        // Add to wishlist
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
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Hero skeleton */}
        <div className="h-[400px] bg-gray-100 rounded-2xl mb-12 animate-pulse" />

        {/* Products skeleton */}
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

      {/* Hero Section with fade in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
      </motion.div>

      {/* New Arrivals with slide up */}
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

      {/* Shop By Category with slide up */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ShopByCategory categories={categories} />
      </motion.div>

      {/* Featured Products with slide up */}
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

      {/* Newsletter with fade in */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Newsletter />
      </motion.div>
    </>
  );
}

export default Home;
