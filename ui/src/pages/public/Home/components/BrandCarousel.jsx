import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const BrandCarousel = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/brands?isActive=true")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;

  const brandList = [...brands, ...brands];

  return (
    <section className="py-[48px] sm:py-[60px] bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-[16px] mb-[32px]">
        <div className="text-center">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-foreground mb-[8px]">
            {t("home.trustedBrands")}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-muted-foreground">
            {t("home.trustedBrandsDesc")}
          </p>
        </div>
      </div>

      <div
        className="relative marquee-container"
        aria-label="Brand logos carousel"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[60px] sm:w-[120px] bg-linear-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[60px] sm:w-[120px] bg-linear-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {brandList.map((brand, index) => (
            <a
              key={`${brand.id}-${index}`}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center shrink-0 w-[140px] sm:w-[180px] h-[70px] sm:h-[80px] mx-[16px] sm:mx-[24px] px-[20px] bg-background rounded-[16px] border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
              title={brand.name}
            >
              <img
                src={brand.logo.light}
                alt={brand.name}
                className="max-h-[36px] sm:max-h-[40px] max-w-[100px] sm:max-w-[120px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 dark:hidden"
              />
              <img
                src={brand.logo.dark}
                alt={brand.name}
                className="max-h-[36px] sm:max-h-[40px] max-w-[100px] sm:max-w-[120px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 hidden dark:block"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
