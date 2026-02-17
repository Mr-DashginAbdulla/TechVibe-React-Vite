import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import Breadcrumb from "./components/Breadcrumb";
import ImageGallery from "./components/ImageGallery";
import SpecsTable from "./components/SpecsTable";
import ReviewsSection from "./components/ReviewsSection";
import WriteReviewModal from "./components/WriteReviewModal";
import RecommendedProducts from "./components/RecommendedProducts";
import ProductActionPanel from "./components/ProductActionPanel";
import { ProductDetailsSkeleton } from "@/components/ui";
import { useProductDetails } from "@/hooks/useProductDetails";

const ProductDetails = () => {
  const { t } = useTranslation();

  const {
    product,
    productLoading,
    productError,
    reviews,
    relatedProducts,
    isInWishlist,
    quantity,
    setQuantity,
    selectedOptions,
    calculatedPrice,
    transformedProductOptions,
    reviewModalOpen,
    setReviewModalOpen,
    editReviewData,
    setEditReviewData,
    handlers,
    user,
  } = useProductDetails();

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

            <ProductActionPanel
              product={product}
              calculatedPrice={calculatedPrice}
              reviews={reviews}
              selectedOptions={selectedOptions}
              transformedProductOptions={transformedProductOptions}
              quantity={quantity}
              setQuantity={setQuantity}
              isInWishlist={isInWishlist}
              onOptionSelect={handlers.handleOptionSelect}
              onAddToCart={handlers.handleAddToCart}
              onBuyNow={handlers.handleBuyNow}
              onToggleWishlist={handlers.handleToggleWishlist}
            />
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
            onHelpful={handlers.handleHelpful}
            onUnhelpful={handlers.handleUnhelpful}
            onEdit={handlers.handleEditReview}
            onDelete={handlers.handleDeleteReview}
            userId={user?.id}
          />

          <RecommendedProducts
            products={relatedProducts}
            onAddToCart={handlers.handleRelatedAddToCart}
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
        onSubmit={handlers.handleSubmitReview}
        productName={product?.name}
        editData={editReviewData}
      />
    </>
  );
};

export default ProductDetails;
