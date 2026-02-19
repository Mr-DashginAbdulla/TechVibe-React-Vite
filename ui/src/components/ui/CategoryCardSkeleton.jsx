import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryCardSkeleton = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="relative overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: "1/1" }}
    >
      <Skeleton height="100%" borderRadius={16} />
      <div className="absolute bottom-4 left-4 right-4">
        <Skeleton width="60%" height={24} />
      </div>
    </div>
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
};

export default CategoryCardSkeleton;
