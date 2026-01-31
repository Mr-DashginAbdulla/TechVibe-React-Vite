import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const RecommendedProducts = ({
  products = [],
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  if (products.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("productDetails.recommendedProducts")}
        </h2>
        <Link
          to="/products"
          className="text-blue-600 font-semibold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
        >
          {t("productDetails.viewAllProducts")}
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            originalPrice={product.oldPrice}
            rating={product.rating}
            reviewCount={product.reviewsCount}
            isNew={product.isNew}
            discount={
              product.oldPrice
                ? Math.round((1 - product.price / product.oldPrice) * 100)
                : null
            }
            onAddToCart={() => onAddToCart(product)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
