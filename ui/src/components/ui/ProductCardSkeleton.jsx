import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
    >
      <div className="aspect-square bg-muted">
        <Skeleton height="100%" borderRadius={0} />
      </div>

      <div className="p-4 space-y-3">
        <Skeleton height={20} width="80%" />

        <div className="flex items-center gap-2">
          <Skeleton width={80} height={16} />
          <Skeleton width={40} height={16} />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton width={70} height={24} />
          <Skeleton width={50} height={16} />
        </div>

        <Skeleton height={40} borderRadius={12} />
      </div>
    </div>
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
};

export default ProductCardSkeleton;
