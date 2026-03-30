import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const ProductGrid = ({
  products,
  viewMode,
  isInWishlist,
  onAddToCart,
  onToggleFavorite,
  onClearFilters,
}) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="text-center py-[60px]">
        <p className="text-[18px] text-muted-foreground mb-[16px]">
          {t("shop.noResults")}
        </p>
        <button
          onClick={onClearFilters}
          className="px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          {t("shop.clearFilters")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-[24px] ${
        viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          rating={product.rating}
          reviewCount={product.reviewsCount || 0}
          originalPrice={product.oldPrice}
          description={product.description}
          isNew={product.isNew}
          isFavorite={isInWishlist(product.id)}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
