import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  useGetRelatedProductsQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistItemQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

import Breadcrumb from "./components/Breadcrumb";
import ImageGallery from "./components/ImageGallery";
import ProductInfo from "./components/ProductInfo";
import PriceBlock from "./components/PriceBlock";
import VariantSelector from "./components/VariantSelector";
import QuantitySelector from "./components/QuantitySelector";
import ActionButtons from "./components/ActionButtons";
import TrustBadges from "./components/TrustBadges";
import SpecsTable from "./components/SpecsTable";
import ReviewsSection from "./components/ReviewsSection";
import WriteReviewModal from "./components/WriteReviewModal";
import RecommendedProducts from "./components/RecommendedProducts";
import { ProductDetailsSkeleton } from "@/components/ui";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [transformedProductOptions, setTransformedProductOptions] = useState(
    [],
  );

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(id);

  const { data: reviews = [] } = useGetProductReviewsQuery(id);

  const { data: relatedProducts = [] } = useGetRelatedProductsQuery(
    { category: product?.category, excludeId: id },
    { skip: !product?.category },
  );

  const { data: wishlistItems = [] } = useCheckWishlistItemQuery(
    { userId: user?.id, productId: id },
    { skip: !user?.id },
  );

  const isInWishlist = wishlistItems.length > 0;

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null);

  useEffect(() => {
    if (product) {
      setCalculatedPrice(product.price);

      const transformedOptions = [];

      if (product.colorOptions?.length > 0) {
        transformedOptions.push({
          id: "color",
          title: "Color",
          type: "color",
          values: product.colorOptions.map((c) => ({
            label: c.name,
            value: c.hex,
            priceModifier: 0,
          })),
        });
      }

      if (product.memoryOptions?.length > 0) {
        transformedOptions.push({
          id: "memory",
          title: "Storage",
          type: "select",
          values: product.memoryOptions.map((m) => ({
            label: m.size,
            priceModifier: m.adj || 0,
          })),
        });
      }

      if (product.options) {
        transformedOptions.push(...product.options);
      }

      const defaults = {};
      transformedOptions.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          defaults[opt.id] = opt.values[0];
        }
      });
      setSelectedOptions(defaults);

      setTransformedProductOptions(transformedOptions);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    let basePrice = product.price;
    let modifiers = 0;

    Object.values(selectedOptions).forEach((optVal) => {
      if (optVal && optVal.priceModifier) {
        modifiers += optVal.priceModifier;
      }
    });

    setCalculatedPrice(basePrice + modifiers);
  }, [selectedOptions, product]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (product) {
      const viewedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
      };

      const saved = localStorage.getItem("recentlyViewed");
      let recentlyViewed = saved ? JSON.parse(saved) : [];

      // Remove if already exists to move to top
      recentlyViewed = recentlyViewed.filter((p) => p.id !== product.id);

      // Add to beginning
      recentlyViewed.unshift(viewedProduct);

      // Limit to 10
      if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
      }

      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
  }, [id, product]);

  const handleOptionSelect = (optionId, valueObj) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueObj,
    }));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t("messages.loginToAddToCart"));
      return;
    }

    try {
      const existingItem = cartItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        const newQuantity = Math.min(
          (existingItem.quantity || 1) + quantity,
          product.stock,
        );
        await updateCartItem({
          id: existingItem.id,
          quantity: newQuantity,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        await addToCart({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: calculatedPrice,
          image: product.image,
          quantity,
          stock: product.stock,
          selectedOptions,
        }).unwrap();
        toast.success(t("productDetails.addedToCart"));
      }
    } catch (error) {
      toast.error(t("messages.failedToAddToCart"));
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error(t("messages.loginRequired"));
      return;
    }

    const buyNowItem = {
      productId: product.id,
      name: product.name,
      price: calculatedPrice,
      image: product.image,
      quantity,
      stock: product.stock,
      selectedOptions,
    };

    navigate("/checkout", { state: { buyNowItem } });
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error(t("messages.loginToUseWishlist"));
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(wishlistItems[0].id).unwrap();
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

  const handleRelatedAddToCart = (prod) => {
    if (!user) {
      toast.error(t("messages.loginToAddToCart"));
      return;
    }
    addToCart({
      userId: user.id,
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1,
      selectedOptions: {},
    });
    toast.success(t("productDetails.addedToCart"));
  };

  const handleSubmitReview = async ({
    rating,
    comment,
    images = [],
    id: reviewId,
  }) => {
    if (!user) {
      toast.error(t("messages.loginRequired"));
      return;
    }

    try {
      if (reviewId) {
        await updateReview({
          id: reviewId,
          rating,
          comment,
          images,
        }).unwrap();
        toast.success(t("productDetails.reviewUpdated"));
        setEditReviewData(null);
      } else {
        await addReview({
          productId: id,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName?.charAt(0) || ""}.`,
          rating,
          comment,
          images,
          date: new Date().toISOString().split("T")[0],
          helpfulCount: 0,
          helpfulBy: [],
          unhelpfulCount: 0,
          unhelpfulBy: [],
        }).unwrap();
        toast.success(t("productDetails.reviewSubmitted"));
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleEditReview = (review) => {
    setEditReviewData(review);
    setReviewModalOpen(true);
  };

  const handleHelpful = async (review) => {
    if (!user) {
      toast.error(t("messages.loginRequired"));
      return;
    }

    if (review.userId === user.id) {
      toast.info(t("productDetails.cannotVoteOwnReview"));
      return;
    }

    const hasVotedHelpful = review.helpfulBy?.includes(user.id);
    const hasVotedUnhelpful = review.unhelpfulBy?.includes(user.id);

    try {
      if (hasVotedHelpful) {
        await updateReview({
          id: review.id,
          helpfulCount: Math.max((review.helpfulCount || 0) - 1, 0),
          helpfulBy: (review.helpfulBy || []).filter((id) => id !== user.id),
        }).unwrap();
      } else {
        const updates = {
          id: review.id,
          helpfulCount: (review.helpfulCount || 0) + 1,
          helpfulBy: [...(review.helpfulBy || []), user.id],
        };
        if (hasVotedUnhelpful) {
          updates.unhelpfulCount = Math.max(
            (review.unhelpfulCount || 0) - 1,
            0,
          );
          updates.unhelpfulBy = (review.unhelpfulBy || []).filter(
            (id) => id !== user.id,
          );
        }
        await updateReview(updates).unwrap();
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleUnhelpful = async (review) => {
    if (!user) {
      toast.error(t("messages.loginRequired"));
      return;
    }

    if (review.userId === user.id) {
      toast.info(t("productDetails.cannotVoteOwnReview"));
      return;
    }

    const hasVotedHelpful = review.helpfulBy?.includes(user.id);
    const hasVotedUnhelpful = review.unhelpfulBy?.includes(user.id);

    try {
      if (hasVotedUnhelpful) {
        await updateReview({
          id: review.id,
          unhelpfulCount: Math.max((review.unhelpfulCount || 0) - 1, 0),
          unhelpfulBy: (review.unhelpfulBy || []).filter(
            (id) => id !== user.id,
          ),
        }).unwrap();
      } else {
        const updates = {
          id: review.id,
          unhelpfulCount: (review.unhelpfulCount || 0) + 1,
          unhelpfulBy: [...(review.unhelpfulBy || []), user.id],
        };
        if (hasVotedHelpful) {
          updates.helpfulCount = Math.max((review.helpfulCount || 0) - 1, 0);
          updates.helpfulBy = (review.helpfulBy || []).filter(
            (id) => id !== user.id,
          );
        }
        await updateReview(updates).unwrap();
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return;

    try {
      await deleteReview(reviewId).unwrap();
      toast.success(t("productDetails.reviewDeleted"));
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  if (productLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("productDetails.productNotFound")}
          </h2>
          <p className="text-gray-500">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <>
      <Helmet>
        <title>{product.name} | TechVibe</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} | TechVibe`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="USD" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Breadcrumb productName={product.name} category={product.category} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <ImageGallery
              images={images}
              productName={product.name}
              isNew={product.isNew}
            />

            <div className="flex flex-col">
              <ProductInfo
                brand={product.brand}
                name={product.name}
                rating={
                  reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : null
                }
                reviewsCount={reviews.length}
                isNew={product.isNew}
              />

              <PriceBlock
                price={calculatedPrice}
                oldPrice={product.oldPrice}
                stock={product.stock}
              />

              <VariantSelector
                options={transformedProductOptions}
                selectedOptions={selectedOptions}
                onOptionSelect={handleOptionSelect}
              />

              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                stock={product.stock}
              />

              <ActionButtons
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
                disabled={product.stock <= 0}
              />

              <TrustBadges />
            </div>
          </div>

          {product.specs && <SpecsTable specs={product.specs} />}

          <ReviewsSection
            reviews={reviews}
            rating={
              reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)
                : null
            }
            totalReviews={reviews.length}
            onWriteReview={() => {
              setEditReviewData(null);
              setReviewModalOpen(true);
            }}
            onHelpful={handleHelpful}
            onUnhelpful={handleUnhelpful}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            userId={user?.id}
          />

          <RecommendedProducts
            products={relatedProducts}
            onAddToCart={handleRelatedAddToCart}
            onToggleFavorite={(productId) =>
              console.log("Toggle favorite:", productId)
            }
          />
        </div>
      </div>

      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setEditReviewData(null);
        }}
        onSubmit={handleSubmitReview}
        productName={product?.name}
        editData={editReviewData}
      />
    </>
  );
};

export default ProductDetails;
