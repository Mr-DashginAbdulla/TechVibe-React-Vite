import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton width={300} height={20} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <Skeleton height="100%" borderRadius={16} />
          </div>

          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden">
                <Skeleton height="100%" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton height={36} width="90%" />

          <div className="flex items-center gap-3">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton width={100} height={40} />
            <Skeleton width={70} height={24} />
          </div>

          <div className="space-y-2">
            <Skeleton count={3} height={16} />
          </div>

          <div className="space-y-3">
            <Skeleton width={80} height={20} />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width={60} height={36} borderRadius={8} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton width={60} height={20} />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width={32} height={32} circle />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Skeleton width={120} height={48} borderRadius={12} />
            <Skeleton width={200} height={48} borderRadius={12} />
          </div>

          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} width={100} height={40} borderRadius={8} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div className="flex gap-4 border-b pb-4">
          <Skeleton width={120} height={32} />
          <Skeleton width={100} height={32} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between py-3">
              <Skeleton width={100} height={16} />
              <Skeleton width={150} height={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
