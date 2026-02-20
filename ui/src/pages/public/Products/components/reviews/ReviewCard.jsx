import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ReviewCard = ({
  review,
  userId,
  onHelpful,
  onUnhelpful,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isOwnReview = review.userId === userId;
  const hasVotedHelpful = review.helpfulBy?.includes(userId);
  const hasVotedUnhelpful = review.unhelpfulBy?.includes(userId);

  const hasMultipleImages = review.images && review.images.length > 1;

  const handlePrev = () => {
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : review.images.length - 1,
    );
  };

  const handleNext = () => {
    setLightboxIndex((prev) =>
      prev < review.images.length - 1 ? prev + 1 : 0,
    );
  };

  const swipeHandlers = hasMultipleImages
    ? {
        drag: "x",
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 1,
        onDragEnd: (e, { offset, velocity }) => {
          const swipe = Math.abs(offset.x) * velocity.x;
          if (swipe < -10000) {
            handleNext();
          } else if (swipe > 10000) {
            handlePrev();
          }
        },
      }
    : {};

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
              {review.userName ? review.userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">
                {review.userName}
              </h4>
              <span className="text-xs text-muted-foreground">
                {review.date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < review.rating ? "currentColor" : "none"}
                  className={
                    i < review.rating ? "text-amber-400" : "text-muted"
                  }
                />
              ))}
            </div>

            {isOwnReview && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(review)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title={t("productDetails.editReview")}
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(review.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title={t("productDetails.deleteReview")}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {review.comment}
        </p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {review.images.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="w-20 h-20 rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLightboxIndex(imgIndex)}
              >
                <img
                  src={img}
                  alt={`Review ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={() => onHelpful && onHelpful(review)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              hasVotedHelpful
                ? "text-success"
                : "text-muted-foreground hover:text-success"
            }`}
          >
            <ThumbsUp
              size={14}
              fill={hasVotedHelpful ? "currentColor" : "none"}
            />
            {t("productDetails.helpful")} ({review.helpfulCount || 0})
          </button>

          <button
            onClick={() => onUnhelpful && onUnhelpful(review)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              hasVotedUnhelpful
                ? "text-destructive"
                : "text-muted-foreground hover:text-destructive"
            }`}
          >
            <ThumbsDown
              size={14}
              fill={hasVotedUnhelpful ? "currentColor" : "none"}
            />
            {t("productDetails.unhelpful")} ({review.unhelpfulCount || 0})
          </button>
        </div>
      </div>

      {lightboxIndex !== null && review.images && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={24} />
          </button>

          {hasMultipleImages && (
            <>
              <button
                className="absolute left-4 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10 hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10 hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative overflow-hidden w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={review.images[lightboxIndex]}
                alt={`Review image ${lightboxIndex + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                {...swipeHandlers}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl cursor-grab active:cursor-grabbing"
              />
            </AnimatePresence>
          </div>

          {hasMultipleImages && (
            <div className="absolute bottom-6 flex items-center gap-3">
              <span className="text-sm font-medium text-foreground/70 bg-card/60 backdrop-blur-sm px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {review.images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReviewCard;
