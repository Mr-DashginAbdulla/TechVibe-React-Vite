import { Heart, ShoppingCart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating = 5,
  reviewCount = 0,
  discount,
  isNew = false,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-border"
    >
      <div className="absolute top-[12px] left-[12px] z-10 flex flex-col gap-[6px]">
        {discount && (
          <span className="bg-primary text-primary-foreground text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="bg-emerald-500 text-white text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            {t("product.new")}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite?.(id);
        }}
        className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-muted-foreground hover:text-red-500"
      >
        <Heart
          className={`w-[18px] h-[18px] ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>

      <Link
        to={`/product/${id}`}
        className="relative w-full h-[220px] bg-muted/50 flex items-center justify-center overflow-hidden"
      >
        <img
          src={image}
          alt={name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
        />
      </Link>

      <div className="p-[16px]">
        <div className="flex items-center gap-[4px] mb-[8px]">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-[14px] h-[14px] ${
                index < Math.floor(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-[12px] text-muted-foreground ml-[4px]">
            ({reviewCount})
          </span>
        </div>

        <Link to={`/product/${id}`}>
          <h3 className="text-[15px] font-medium text-foreground mb-[8px] line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <span className="text-[18px] font-bold text-foreground">
              ${Number(price).toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[14px] text-muted-foreground line-through">
                ${Number(originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart?.(id)}
            className="w-[40px] h-[40px] bg-primary hover:bg-primary/90 rounded-[10px] flex items-center justify-center transition-colors shadow-lg shadow-primary/20"
            title={t("product.addToCart")}
          >
            <ShoppingCart className="w-[18px] h-[18px] text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
