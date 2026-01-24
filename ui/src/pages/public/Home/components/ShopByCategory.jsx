import {
  ArrowUpRight,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShopByCategory = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 1,
      name: t("categories.laptops"),
      icon: Laptop,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
      link: "/products?category=laptops",
    },
    {
      id: 2,
      name: t("categories.smartphones"),
      icon: Smartphone,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      link: "/products?category=smartphones",
    },
    {
      id: 3,
      name: t("categories.wearables"),
      icon: Watch,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      link: "/products?category=smartwatches",
    },
    {
      id: 4,
      name: t("categories.audio"),
      icon: Headphones,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      link: "/products?category=audio",
    },
    {
      id: 5,
      name: t("categories.cameras"),
      icon: Camera,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
      link: "/products?category=cameras",
    },
    {
      id: 6,
      name: t("categories.gaming"),
      icon: Gamepad2,
      image:
        "https://images.unsplash.com/photo-1493711662062-fa541f7f897a?w=600&q=80",
      link: "/products?category=gaming",
    },
  ];

  return (
    <section className="py-[60px] bg-[#F9FAFB]">
      <div className="container mx-auto px-[16px]">
        <div className="text-center mb-[40px]">
          <h2 className="text-[28px] font-bold text-[#111827] mb-[12px]">
            {t("home.shopByCategory")}
          </h2>
          <p className="text-[16px] text-[#6B7280]">
            {t("home.shopByCategoryDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative h-[220px] rounded-[20px] overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute top-[16px] left-[16px] w-[44px] h-[44px] bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center">
                <category.icon className="w-[22px] h-[22px] text-white" />
              </div>
              <div className="absolute bottom-[16px] left-[16px] right-[16px] flex items-end justify-between">
                <h3 className="text-[20px] font-bold text-white">
                  {category.name}
                </h3>
                <div className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center group-hover:bg-[#3B82F6] transition-colors">
                  <ArrowUpRight className="w-[18px] h-[18px] text-[#111827] group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
