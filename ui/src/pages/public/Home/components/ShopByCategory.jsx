import {
  ArrowUpRight,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Package, // Default ikon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShopByCategory = ({ categories = [] }) => {
  const { t } = useTranslation();

  // Serverdən gələn ID-lərə uyğun ikonlar (Mapping)
  const iconMap = {
    laptops: Laptop,
    smartphones: Smartphone,
    wearables: Watch,
    audio: Headphones,
    cameras: Camera,
    gaming: Gamepad2,
  };

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
          {categories.map((category) => {
            // İkonu tapırıq, yoxdursa default 'Package' ikonu qoyuruq
            const IconComponent = iconMap[category.id] || Package;

            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative h-[220px] rounded-[20px] overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* İkon */}
                <div className="absolute top-[16px] left-[16px] w-[44px] h-[44px] bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center">
                  <IconComponent className="w-[22px] h-[22px] text-white" />
                </div>

                {/* Ad və Ox */}
                <div className="absolute bottom-[16px] left-[16px] right-[16px] flex items-end justify-between">
                  <h3 className="text-[20px] font-bold text-white">
                    {category.name}
                  </h3>
                  <div className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center group-hover:bg-[#3B82F6] transition-colors">
                    <ArrowUpRight className="w-[18px] h-[18px] text-[#111827] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
