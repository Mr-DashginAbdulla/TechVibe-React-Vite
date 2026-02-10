import { useState, useRef, useEffect } from "react";
import { Star, X, ImagePlus, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const WriteReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName,
  editData = null,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 3;
  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setRating(editData.rating || 0);
      setComment(editData.comment || "");
      setImages(editData.images || []);
    } else {
      setRating(0);
      setComment("");
      setImages([]);
    }
  }, [editData, isOpen]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    setIsUploading(true);

    try {
      const newImages = await Promise.all(
        filesToProcess.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }),
      );

      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    onSubmit({
      rating,
      comment,
      images,
      ...(isEditMode && { id: editData.id }),
    });
    setRating(0);
    setComment("");
    setImages([]);
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto border border-border">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-2">
          {isEditMode
            ? t("productDetails.editReview")
            : t("productDetails.writeReview")}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{productName}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              {t("productDetails.yourRating")}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    fill={
                      star <= (hoverRating || rating) ? "currentColor" : "none"
                    }
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-muted"
                    }
                  />
                </button>
              ))}
            </div>
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

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive hover:bg-destructive/90 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="review-images"
                />
                <label
                  htmlFor="review-images"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} />
                      {t("productDetails.addPhotos")}
                    </>
                  )}
                </label>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {t("productDetails.maxPhotosHint", { max: MAX_IMAGES })}
            </p>
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
