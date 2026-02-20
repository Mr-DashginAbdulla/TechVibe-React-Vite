import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import ProductCard from "@/components/product/ProductCard";

const SubcategoryProducts = ({
  categories = [],
  products = [],
  onAddToCart,
  onToggleFavorite,
  wishlistItems = [],
}) => {
  const { t } = useTranslation();

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const subcategories = categories.filter((cat) => cat.parentId !== null);

  const subcategoryRows = subcategories
    .map((subcat) => {
      const subcatProducts = products.filter((p) => p.category === subcat.id);
      return {
        ...subcat,
        products: subcatProducts.slice(0, 8),
      };
    })
    .filter((row) => row.products.length > 0);

  if (subcategoryRows.length === 0) return null;

  return (
    <section className="py-[48px] sm:py-[60px] bg-background">
      <div className="container mx-auto px-[16px]">
        <div className="text-center mb-[40px]">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-foreground mb-[8px]">
            {t("home.exploreBySubcategory")}
          </h2>
          <p className="text-[14px] sm:text-[16px] text-muted-foreground">
            {t("home.exploreBySubcategoryDesc")}
          </p>
        </div>

        <div className="space-y-[40px] sm:space-y-[48px]">
          {subcategoryRows.map((subcat) => (
            <SubcategoryRow
              key={subcat.id}
              subcat={subcat}
              isInWishlist={isInWishlist}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const SubcategoryRow = ({
  subcat,
  isInWishlist,
  onAddToCart,
  onToggleFavorite,
  t,
}) => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-[16px] sm:mb-[20px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[3px] h-[24px] bg-primary rounded-full"></div>
          <h3 className="text-[18px] sm:text-[22px] font-semibold text-foreground">
            {t(`categories.${subcat.id}`)}
          </h3>
        </div>
        <Link
          to={`/shop?category=${subcat.id}`}
          className="flex items-center gap-[6px] text-[13px] sm:text-[14px] text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {t("home.viewAll")}
          <ArrowRight className="w-[16px] h-[16px]" />
        </Link>
      </div>

      <div className="relative group/row">
        <div
          ref={scrollRef}
          className="flex gap-[16px] overflow-x-auto snap-x snap-mandatory pb-[8px] scrollbar-hide"
        >
          {subcat.products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[220px] sm:w-[240px] lg:w-[260px] snap-start"
            >
              <ProductCard
                {...product}
                isFavorite={isInWishlist(product.id)}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}

          <Link
            to={`/shop?category=${subcat.id}`}
            className="shrink-0 w-[80px] sm:w-[100px] flex flex-col items-center justify-center gap-[8px] rounded-[16px] border border-border/60 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 snap-start"
          >
            <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ChevronRight className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-primary" />
            </div>
            <span className="text-[11px] sm:text-[12px] font-medium text-muted-foreground text-center leading-tight px-[4px]">
              {t("home.viewAll")}
            </span>
          </Link>
        </div>

        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute -right-[16px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-background border border-border/80 shadow-lg rounded-full items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white hover:border-primary z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-[20px] h-[20px]" />
        </button>
      </div>
    </div>
  );
};

export default SubcategoryProducts;
