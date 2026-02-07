import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * ProductCardSkeleton - Loading skeleton for product cards
 */
const ProductCardSkeleton = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-100">
        <Skeleton height="100%" borderRadius={0} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton height={20} width="80%" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={16} />
          <Skeleton width={40} height={16} />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton width={70} height={24} />
          <Skeleton width={50} height={16} />
        </div>

        {/* Button */}
        <Skeleton height={40} borderRadius={12} />
      </div>
    </div>
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
};

export default ProductCardSkeleton;
