import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

const CategoryShowcase = ({
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

  const categoryRows = subcategories
    .map((subcat) => {
      const subcatProducts = products.filter((p) => p.category === subcat.id);
      return {
        ...subcat,
        products: subcatProducts.slice(0, 4),
      };
    })
    .filter((row) => row.products.length > 0);

  if (categoryRows.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            {t("home.exploreBySubcategory")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t("home.exploreBySubcategoryDesc")}
          </motion.p>
        </div>

        <div className="flex flex-col gap-20 md:gap-32">
          {categoryRows.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              index={index}
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

const CategoryRow = ({
  category,
  index,
  isInWishlist,
  onAddToCart,
  onToggleFavorite,
  t,
}) => {
  const isEven = index % 2 === 0;

  const gradients = [
    "from-violet-600/90 via-purple-600/80 to-indigo-700/90",
    "from-emerald-600/90 via-teal-600/80 to-cyan-700/90",
    "from-rose-600/90 via-red-600/80 to-orange-700/90",
    "from-blue-600/90 via-sky-600/80 to-cyan-700/90",
    "from-amber-500/90 via-orange-500/80 to-red-600/90",
  ];

  const gradient = gradients[index % gradients.length];

  const heroImage =
    category.image ||
    category.products[0]?.image ||
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-full flex flex-col justify-center p-8 md:p-12 shadow-xl group ${isEven ? "lg:order-1" : "lg:order-2"}`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 bg-linear-to-br ${gradient} mix-blend-multiply opacity-90`}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 text-white flex flex-col items-start h-full justify-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wider mb-4 uppercase">
            {t(`categories.${category.id}`) || category.name}
          </span>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {t(`categories.${category.id}_title`) ||
              `Best ${t(`categories.${category.id}`)} Collection`}
          </h3>

          <p className="text-white/90 text-lg mb-8 max-w-md">
            {t(`categories.${category.id}_desc`) ||
              `Discover our premium selection of ${t(`categories.${category.id}`).toLowerCase()} designed for performance and style.`}
          </p>

          <Link
            to={`/shop?category=${category.id}`}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold transition-all hover:bg-white/90 hover:scale-105 active:scale-95 group-hover:shadow-lg lg:mt-auto"
          >
            {t("home.viewAll")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <div
        className={`grid grid-cols-2 gap-4 sm:gap-6 ${!isEven ? "lg:order-1" : "lg:order-2"}`}
      >
        {category.products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <ProductCard
              {...product}
              isFavorite={isInWishlist(product.id)}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              compact={true}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;
