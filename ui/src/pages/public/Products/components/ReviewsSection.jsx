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

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        {t("productDetails.customerReviews")}
      </h2>
      <p className="text-gray-500 mb-6">
        {t("productDetails.reviewsSubtitle")}
      </p>

      {/* Reviews Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
        {/* Rating Score */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {rating !== null ? rating : "-"}
          </div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={
                  rating !== null && i < Math.floor(rating) ? "#F59E0B" : "none"
                }
                className={
                  rating !== null && i < Math.floor(rating)
                    ? "text-amber-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            {totalReviews > 0
              ? `${totalReviews} ${t("productDetails.reviews")}`
              : t("productDetails.noReviews")}
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 w-6">
                {stars}
              </span>
              <Star size={14} fill="#F59E0B" className="text-amber-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="flex items-center">
          <button
            onClick={onWriteReview}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {t("productDetails.writeReview")}
          </button>
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwnReview = review.userId === userId;
            const hasVotedHelpful = review.helpfulBy?.includes(userId);
            const hasVotedUnhelpful = review.unhelpfulBy?.includes(userId);

            return (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.userName
                        ? review.userName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {review.userName}
                      </h4>
                      <span className="text-xs text-gray-400">
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
                          fill={i < review.rating ? "#F59E0B" : "none"}
                          className={
                            i < review.rating
                              ? "text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    {/* Edit/Delete buttons for own reviews */}
                    {isOwnReview && (
                      <div className="flex items-center gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(review)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t("productDetails.editReview")}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(review.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={t("productDetails.deleteReview")}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {review.images.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
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

                {/* Vote Buttons */}
                <div className="flex items-center gap-4">
                  {/* Helpful */}
                  <button
                    onClick={() => onHelpful && onHelpful(review)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      hasVotedHelpful
                        ? "text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      fill={hasVotedHelpful ? "currentColor" : "none"}
                    />
                    {t("productDetails.helpful")} ({review.helpfulCount || 0})
                  </button>

                  {/* Unhelpful */}
                  <button
                    onClick={() => onUnhelpful && onUnhelpful(review)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      hasVotedUnhelpful
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
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
        <p className="text-gray-500 text-center py-8">
          {t("productDetails.noReviews")}
        </p>
      )}
    </div>
  );
};

export default ReviewsSection;
