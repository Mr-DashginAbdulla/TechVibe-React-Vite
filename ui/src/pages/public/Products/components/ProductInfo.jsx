import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProductInfo = ({ brand, name, rating, reviewsCount, isNew }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        {brand && (
          <span className="text-xs font-semibold bg-accent text-accent-foreground px-3 py-1.5 rounded-md uppercase tracking-wide">
            {brand}
          </span>
        )}
        {isNew && (
          <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-md">
            {t("productDetails.new")}
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
        {name}
      </h1>

      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < Math.floor(rating) ? "currentColor" : "none"}
              className={
                i < Math.floor(rating) ? "text-amber-400" : "text-muted"
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-foreground">{rating}</span>
        <span className="text-sm text-muted-foreground">
          ({reviewsCount} {t("productDetails.reviews")})
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
