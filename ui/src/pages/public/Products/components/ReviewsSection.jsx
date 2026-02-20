import { useTranslation } from "react-i18next";
import RatingSummary from "./reviews/RatingSummary";
import ReviewCard from "./reviews/ReviewCard";

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

      <RatingSummary
        rating={rating}
        totalReviews={totalReviews}
        ratingDistribution={ratingDistribution}
        onWriteReview={onWriteReview}
      />

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              userId={userId}
              onHelpful={onHelpful}
              onUnhelpful={onUnhelpful}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
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
