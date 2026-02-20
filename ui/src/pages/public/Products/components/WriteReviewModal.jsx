import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import useWriteReview from "./reviews/useWriteReview";
import StarRatingInput from "./reviews/StarRatingInput";
import ImageUploader from "./reviews/ImageUploader";

const WriteReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName,
  editData = null,
}) => {
  const { t } = useTranslation();

  const {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    images,
    isUploading,
    isEditMode,
    MAX_IMAGES,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleClose,
  } = useWriteReview(editData, isOpen, onSubmit, onClose);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="relative bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-border"
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-card pt-6 px-6 pb-2 border-b border-border rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-foreground mb-1">
            {isEditMode
              ? t("productDetails.editReview")
              : t("productDetails.writeReview")}
          </h2>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              {t("productDetails.yourRating")}
            </label>
            <StarRatingInput
              rating={rating}
              hoverRating={hoverRating}
              onRate={setRating}
              onHover={setHoverRating}
              onLeave={() => setHoverRating(0)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("productDetails.yourReviewText")}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("productDetails.reviewPlaceholder")}
              rows={4}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t("productDetails.uploadPhotos")} ({images.length}/{MAX_IMAGES})
            </label>
            <ImageUploader
              images={images}
              maxImages={MAX_IMAGES}
              isUploading={isUploading}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-xl transition-colors"
          >
            {isEditMode
              ? t("productDetails.updateReview")
              : t("productDetails.submitReview")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
