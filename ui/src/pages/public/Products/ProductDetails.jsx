import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
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
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

// Components
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
import RecommendedProducts from "./components/RecommendedProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // RTK Query hooks
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

  // Wishlist check
  const { data: wishlistItems = [] } = useCheckWishlistItemQuery(
    { userId: user?.id, productId: id },
    { skip: !user?.id },
  );

  const isInWishlist = wishlistItems.length > 0;

  // Get user's cart to check for duplicates
  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  // Mutations
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // Initialize options and price when product loads
  useEffect(() => {
    if (product) {
      setCalculatedPrice(product.price);

      // Set default options
      if (product.options) {
        const defaults = {};
        product.options.forEach((opt) => {
          if (opt.values && opt.values.length > 0) {
            defaults[opt.id] = opt.values[0];
          }
        });
        setSelectedOptions(defaults);
      }
    }
  }, [product]);

  // Recalculate price when options change
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

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleOptionSelect = (optionId, valueObj) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueObj,
    }));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      // Check if product already exists in cart
      const existingItem = cartItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        // Update quantity of existing item
        await updateCartItem({
          id: existingItem.id,
          quantity: (existingItem.quantity || 1) + quantity,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        // Add new item to cart
        await addToCart({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: calculatedPrice,
          image: product.image,
          quantity,
          selectedOptions,
        }).unwrap();
        toast.success(t("productDetails.addedToCart"));
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    // Navigate directly to checkout - user can add items from product page
    window.location.href = "/checkout";
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to use wishlist");
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
      toast.error("Failed to update wishlist");
    }
  };

  const handleRelatedAddToCart = (prod) => {
    if (!user) {
      toast.error("Please login to add items to cart");
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

  // Loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">{t("productDetails.loading")}</span>
        </div>
      </div>
    );
  }

  // Error state
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
      </Helmet>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb productName={product.name} category={product.category} />

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Left - Image Gallery */}
            <ImageGallery
              images={images}
              productName={product.name}
              isNew={product.isNew}
            />

            {/* Right - Product Info */}
            <div className="flex flex-col">
              <ProductInfo
                brand={product.brand}
                name={product.name}
                rating={product.rating}
                reviewsCount={product.reviewsCount || reviews.length}
                isNew={product.isNew}
              />

              <PriceBlock
                price={calculatedPrice}
                oldPrice={product.oldPrice}
                stock={product.stock}
              />

              <VariantSelector
                options={product.options}
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

          {/* Technical Specifications */}
          {product.specs && <SpecsTable specs={product.specs} />}

          {/* Customer Reviews */}
          <ReviewsSection
            reviews={reviews}
            rating={product.rating}
            totalReviews={product.reviewsCount || reviews.length}
          />

          {/* Recommended Products */}
          <RecommendedProducts
            products={relatedProducts}
            onAddToCart={handleRelatedAddToCart}
            onToggleFavorite={(productId) =>
              console.log("Toggle favorite:", productId)
            }
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
