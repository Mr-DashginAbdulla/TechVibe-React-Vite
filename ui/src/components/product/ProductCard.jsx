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
  description,
  isNew = false,
  isFavorite = false,
  viewMode = "grid",
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  if (viewMode === "list") {
    return (
      <div className="group relative bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-border flex flex-col sm:flex-row transition-all duration-300">
        <div className="relative w-full sm:w-[280px] shrink-0 h-[280px] sm:h-auto bg-muted/50 flex items-center justify-center overflow-hidden">
          <div className="absolute top-[12px] left-[12px] z-10 flex flex-col gap-[6px]">
            {discount && (
              <span className="bg-primary text-primary-foreground text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="bg-success text-white text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
                {t("product.new")}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(id);
            }}
            className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-muted-foreground hover:text-destructive"
          >
            <Heart
              className={`w-[18px] h-[18px] ${
                isFavorite ? "fill-destructive text-destructive" : ""
              }`}
            />
          </button>

          <Link
            to={`/product/${id}`}
            className="w-full h-full flex items-center justify-center p-4"
          >
            <img
              src={image}
              alt={name}
              className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
            />
          </Link>
        </div>

        <div className="flex-1 p-[24px] flex flex-col">
          <div className="flex items-start justify-between mb-[12px]">
            <div>
              <Link to={`/product/${id}`}>
                <h3 className="text-[20px] font-semibold text-foreground mb-[8px] hover:text-primary transition-colors">
                  {name}
                </h3>
              </Link>
              <div className="flex items-center gap-[4px]">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-[16px] h-[16px] ${
                      index < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="text-[14px] text-muted-foreground ml-[6px]">
                  ({reviewCount} {t("product.reviews")})
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-[4px] min-w-[100px]">
              <span className="text-[24px] font-bold text-primary">
                ${Number(price).toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[16px] text-muted-foreground line-through">
                  ${Number(originalPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 mb-[20px]">
            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-[12px] mt-auto border-t border-border pt-[20px]">
            <button
              onClick={() => onAddToCart?.(id)}
              className="flex-1 h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-[12px] flex items-center justify-center gap-[8px] transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              <ShoppingCart className="w-[20px] h-[20px]" />
              {t("product.addToCart")}
            </button>
            <Link
              to={`/product/${id}`}
              className="h-[48px] px-[24px] border border-border bg-card hover:bg-accent text-foreground font-medium rounded-[12px] flex items-center justify-center transition-colors"
            >
              {t("common.viewDetails")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-border h-full flex flex-col"
    >
      <div className="absolute top-[12px] left-[12px] z-10 flex flex-col gap-[6px]">
        {discount && (
          <span className="bg-primary text-primary-foreground text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="bg-success text-white text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            {t("product.new")}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite?.(id);
        }}
        className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-muted-foreground hover:text-destructive"
      >
        <Heart
          className={`w-[18px] h-[18px] ${
            isFavorite ? "fill-destructive text-destructive" : ""
          }`}
        />
      </button>

      <Link
        to={`/product/${id}`}
        className="relative w-full aspect-4/3 bg-muted/50 flex items-center justify-center overflow-hidden"
      >
        <img
          src={image}
          alt={name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
        />
      </Link>

      <div className="p-[16px] flex flex-col flex-1">
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

        <Link to={`/product/${id}`} className="mb-[8px] block">
          <h3 className="text-[15px] font-medium text-foreground line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
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
