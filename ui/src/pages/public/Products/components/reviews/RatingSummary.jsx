import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const RatingSummary = ({
  rating,
  totalReviews,
  ratingDistribution,
  onWriteReview,
}) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default RatingSummary;
