import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "@/store/api/productsApi";

import { useProductSelection } from "./product/useProductSelection";
import { useProductCart } from "./product/useProductCart";
import { useProductReviews } from "./product/useProductReviews";
import { useProductWishlist } from "./product/useProductWishlist";
import { useRecentlyViewed } from "./product/useRecentlyViewed";

export const useProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(id);

  const { data: relatedProducts = [] } = useGetRelatedProductsQuery(
    { category: product?.category, excludeId: id },
    { skip: !product?.category },
  );

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  return {
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

    setQuantity,
    setReviewModalOpen,
    setEditReviewData,
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
