import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import HeroSection from "./HeroSection";
import NewArrivals from "./components/NewArrivals";
import ShopByCategory from "./components/ShopByCategory";
import FeaturedProducts from "./components/FeaturedProducts";
import Newsletter from "./components/Newsletter";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <NewArrivals
        products={newArrivals}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        wishlistItems={wishlistItems}
      />
      <ShopByCategory categories={categories} />
      <FeaturedProducts
        products={featuredProducts}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        wishlistItems={wishlistItems}
      />
      <Newsletter />
    </>
  );
}

export default Home;
