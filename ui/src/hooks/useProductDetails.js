import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "@/store/api/productsApi";

import { useProductSelection } from "./useProductSelection";
import { useProductCart } from "./useProductCart";
import { useProductReviews } from "./useProductReviews";
import { useProductWishlist } from "./useProductWishlist";
import { useRecentlyViewed } from "./useRecentlyViewed";

export const useProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  // 1. Fetch Core Product Data
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(id);

  const { data: relatedProducts = [] } = useGetRelatedProductsQuery(
    { category: product?.category, excludeId: id },
    { skip: !product?.category },
  );

  // 2. Initialize Sub-Hooks
  const {
    selectedOptions,
    calculatedPrice,
    transformedProductOptions,
    handleOptionSelect,
  } = useProductSelection(product);

  const {
    quantity,
    setQuantity,
    cartItems,
    handleAddToCart,
    handleBuyNow,
    handleRelatedAddToCart,
  } = useProductCart(user, product, calculatedPrice, selectedOptions);

  const {
    reviews,
    reviewModalOpen,
    setReviewModalOpen,
    editReviewData,
    setEditReviewData,
    handleSubmitReview,
    handleEditReview,
    handleHelpful,
    handleUnhelpful,
    handleDeleteReview,
  } = useProductReviews(id, user);

  const {
    wishlistItems,
    isInWishlist,
    isProductInWishlist,
    handleToggleWishlist,
    handleRelatedToggleFavorite,
  } = useProductWishlist(id, user);

  useRecentlyViewed(product);

  // 3. Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 4. Return Unified API
  return {
    // Data
    product,
    productLoading,
    productError,
    reviews,
    relatedProducts,
    wishlistItems,
    isInWishlist,
    isProductInWishlist,
    cartItems,
    quantity,
    selectedOptions,
    calculatedPrice,
    transformedProductOptions,
    reviewModalOpen,
    editReviewData,
    user,

    // State Setters
    setQuantity,
    setReviewModalOpen,
    setEditReviewData,

    // Handlers (Wrapped to inject 't' where needed)
    handlers: {
      handleOptionSelect,
      handleAddToCart: () => handleAddToCart(t),
      handleBuyNow: () => handleBuyNow(t),
      handleToggleWishlist: () => handleToggleWishlist(product, t),
      handleRelatedAddToCart: (prod) => handleRelatedAddToCart(prod, t),
      handleRelatedToggleFavorite: (productId) =>
        handleRelatedToggleFavorite(productId, t),
      handleSubmitReview: (data) => handleSubmitReview(data, t),
      handleEditReview,
      handleHelpful: (review) => handleHelpful(review, t),
      handleUnhelpful: (review) => handleUnhelpful(review, t),
      handleDeleteReview: (reviewId) => handleDeleteReview(reviewId, t),
    },
  };
};
