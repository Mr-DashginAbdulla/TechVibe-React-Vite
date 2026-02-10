import { Star, ThumbsUp, ThumbsDown, Trash2, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

const ReviewsSection = ({
  reviews = [],
  rating,
  totalReviews,
  onWriteReview,
  onHelpful,
  onUnhelpful,
  onDelete,
  onEdit,
  userId,
}) => {
  const { t } = useTranslation();

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {t("productDetails.customerReviews")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("productDetails.reviewsSubtitle")}
      </p>

      <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-muted/30 rounded-xl">
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <div className="text-5xl font-bold text-foreground mb-2">
            {rating !== null ? rating : "-"}
          </div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={
                  rating !== null && i < Math.floor(rating)
                    ? "currentColor"
                    : "none"
                }
                className={
                  rating !== null && i < Math.floor(rating)
                    ? "text-amber-400"
                    : "text-muted"
                }
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {totalReviews > 0
              ? `${totalReviews} ${t("productDetails.reviews")}`
              : t("productDetails.noReviews")}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6">
                {stars}
              </span>
              <Star size={14} fill="currentColor" className="text-amber-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <button
            onClick={onWriteReview}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {t("productDetails.writeReview")}
          </button>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwnReview = review.userId === userId;
            const hasVotedHelpful = review.helpfulBy?.includes(userId);
            const hasVotedUnhelpful = review.unhelpfulBy?.includes(userId);

            return (
              <div
                key={review.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.userName
                        ? review.userName.charAt(0).toUpperCase()
                        : "U"}
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
                        onClick={() => window.open(img, "_blank")}
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
                        ? "text-emerald-600"
                        : "text-muted-foreground hover:text-emerald-600"
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
                    {t("productDetails.unhelpful")} (
                    {review.unhelpfulCount || 0})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          {t("productDetails.noReviews")}
        </p>
      )}
    </div>
  );
};

export default ReviewsSection;
