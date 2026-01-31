import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProductInfo = ({ brand, name, rating, reviewsCount, isNew }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      {/* Brand & New Badge */}
      <div className="flex items-center gap-3 mb-3">
        {brand && (
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md uppercase tracking-wide">
            {brand}
          </span>
        )}
        {isNew && (
          <span className="text-xs font-semibold bg-emerald-500 text-white px-3 py-1.5 rounded-md">
            {t("productDetails.new")}
          </span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
        {name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < Math.floor(rating) ? "#F59E0B" : "none"}
              className={
                i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-900">{rating}</span>
        <span className="text-sm text-gray-500">
          ({reviewsCount} {t("productDetails.reviews")})
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
