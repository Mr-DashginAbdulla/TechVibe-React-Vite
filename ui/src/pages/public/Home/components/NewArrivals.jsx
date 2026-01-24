import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/product/ProductCard";

const NewArrivals = ({ products = [], onAddToCart, onToggleFavorite }) => {
  const { t } = useTranslation();

  const demoProducts = [
    {
      id: 1,
      name: 'MacBook Pro 14" M3 Pro',
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
      price: 1999.99,
      rating: 5,
      reviewCount: 128,
      isNew: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max 256GB",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
      price: 1199.99,
      rating: 5,
      reviewCount: 256,
      isNew: true,
    },
    {
      id: 3,
      name: "Apple Watch Series 9",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
      price: 399.99,
      rating: 4,
      reviewCount: 89,
      isNew: true,
    },
    {
      id: 4,
      name: "AirPods Pro 2nd Gen",
      image:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80",
      price: 249.99,
      rating: 5,
      reviewCount: 312,
      isNew: true,
    },
  ];

  const displayProducts = products.length > 0 ? products : demoProducts;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
