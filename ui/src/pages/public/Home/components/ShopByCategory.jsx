import {
  ArrowUpRight,
  Laptop,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Gamepad2,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShopByCategory = ({ categories = [] }) => {
  const { t } = useTranslation();

  const iconMap = {
    computers: Monitor,
    laptops: Laptop,
    phones: Smartphone,
    smartphones: Smartphone,
    gaming: Gamepad2,
    audio: Headphones,
    cameras: Camera,
  };

  const parentCategories = categories.filter((cat) => cat.parentId === null);

  return (
    <section className="py-[60px] bg-muted/30">
      <div className="container mx-auto px-[16px]">
        <div className="text-center mb-[40px]">
          <h2 className="text-[28px] font-bold text-foreground mb-[12px]">
            {t("home.shopByCategory")}
          </h2>
          <p className="text-[16px] text-muted-foreground">
            {t("home.shopByCategoryDesc")}
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-[16px] sm:gap-[24px] pb-4 sm:pb-0 -mx-[16px] px-[16px] sm:mx-0 sm:px-0 scrollbar-hide">
          {parentCategories.map((category) => {
            const IconComponent = iconMap[category.id] || Package;

            return (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative h-[220px] rounded-[20px] overflow-hidden shrink-0 w-[85%] sm:w-auto snap-center"
              >
                <img
                  src={category.image}
                  alt={t(`categories.${category.id}`)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

                <div className="absolute top-[16px] left-[16px] w-[44px] h-[44px] bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center">
                  <IconComponent className="w-[22px] h-[22px] text-white" />
                </div>
                <div className="absolute bottom-[16px] left-[16px] right-[16px] flex items-end justify-between">
                  <h3 className="text-[20px] font-bold text-white">
                    {t(`categories.${category.id}`)}
                  </h3>
                  <div className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowUpRight className="w-[18px] h-[18px] text-black group-hover:text-white transition-colors" />
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
