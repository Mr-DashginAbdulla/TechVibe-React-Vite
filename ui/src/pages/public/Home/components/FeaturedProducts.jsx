import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = ({ products = [], onAddToCart, onToggleFavorite }) => {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);

  const demoProducts = [
    {
      id: 101,
      name: "Dell XPS 15 OLED Laptop",
      image:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
      price: 1799.99,
      originalPrice: 1999.99,
      rating: 5,
      reviewCount: 156,
      discount: 10,
    },
    {
      id: 102,
      name: "Samsung Galaxy S24 Ultra",
      image:
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
      price: 1099.99,
      originalPrice: 1299.99,
      rating: 5,
      reviewCount: 203,
      discount: 15,
    },
    {
      id: 103,
      name: "Sony WH-1000XM5 Headphones",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80",
      price: 348.0,
      originalPrice: 399.99,
      rating: 5,
      reviewCount: 428,
      discount: 13,
    },
    {
      id: 104,
      name: 'iPad Pro 12.9" M2 Chip',
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
      price: 1049.99,
      originalPrice: 1199.99,
      rating: 5,
      reviewCount: 187,
      discount: 12,
    },
    {
      id: 105,
      name: "GoPro HERO12 Black",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
      price: 349.99,
      originalPrice: 399.99,
      rating: 4,
      reviewCount: 94,
      discount: 12,
    },
  ];

  const displayProducts = products.length > 0 ? products : demoProducts;

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

        <div
          id="featured-products-container"
          className="flex gap-[24px] overflow-x-auto scrollbar-hide pb-[16px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px]">
              <ProductCard
                {...product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
