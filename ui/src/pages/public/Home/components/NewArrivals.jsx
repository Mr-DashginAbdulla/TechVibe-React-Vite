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

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  return (
    <section className="py-[60px] bg-background">
      <div className="container mx-auto px-[16px]">
        <div className="flex items-center justify-between mb-[32px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[4px] h-[32px] bg-emerald-500 rounded-full"></div>
            <h2 className="text-[28px] font-bold text-foreground">
              {t("home.newArrivals")}
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-[8px] text-primary hover:text-primary/90 font-medium transition-colors"
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
          <p className="text-center text-muted-foreground py-10">
            {t("common.noProductsFound")}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
