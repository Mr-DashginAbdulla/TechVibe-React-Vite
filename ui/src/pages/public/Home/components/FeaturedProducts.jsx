import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = ({ products = [], onAddToCart, onToggleFavorite }) => {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById("featured-products-container");
    if (container) {
      const scrollAmount = 320;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-[60px] bg-white">
      <div className="container mx-auto px-[16px]">
        <div className="flex items-center justify-between mb-[32px]">
          <h2 className="text-[28px] font-bold text-[#111827]">
            {t("home.featuredProducts")}
          </h2>

          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => scroll("left")}
              className="w-[44px] h-[44px] bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronLeft className="w-[20px] h-[20px] text-[#374151]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-[44px] h-[44px] bg-[#3B82F6] rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors"
            >
              <ChevronRight className="w-[20px] h-[20px] text-white" />
            </button>
          </div>
        </div>

        {products.length > 0 ? (
          <div
            id="featured-products-container"
            className="flex gap-[24px] overflow-x-auto scrollbar-hide pb-[16px]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px]">
                <ProductCard
                  {...product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            Öne çıxan məhsul tapılmadı.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
