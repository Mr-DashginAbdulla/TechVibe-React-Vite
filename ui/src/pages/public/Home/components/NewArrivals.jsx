import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const NewArrivals = ({
  products = [],
  onAddToCart,
  onToggleFavorite,
  wishlistItems = [],
}) => {
  const { t } = useTranslation();

  // Helper function to check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
    <section className="py-[60px] bg-white">
      <div className="container mx-auto px-[16px]">
        <div className="flex items-center justify-between mb-[32px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[4px] h-[32px] bg-[#10B981] rounded-full"></div>
            <h2 className="text-[28px] font-bold text-[#111827]">
              {t("home.newArrivals")}
            </h2>
          </div>
          <Link
            to="/products?filter=new"
            className="flex items-center gap-[8px] text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors"
          >
            {t("home.viewAll")}
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isFavorite={isInWishlist(product.id)}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            Yeni məhsul tapılmadı.
          </p>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
