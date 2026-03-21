import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingCart, Trash2, Star } from "lucide-react";

const WishlistItemCard = ({ item, onRemove, onAddToCart }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="group relative bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-border transition-all duration-300 hover:-translate-y-1">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:bg-destructive/10 transition-all text-destructive"
        title={t("wishlist.removeFromList")}
      >
        <Trash2 className="w-[18px] h-[18px]" />
      </button>

      <Link
        to={`/product/${item.productId}`}
        className="relative w-full h-[220px] bg-muted/50 flex items-center justify-center overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
        />
      </Link>

      <div className="p-[16px]">
        <div className="flex items-center gap-[4px] mb-[8px]">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className="w-[14px] h-[14px] fill-primary text-primary"
            />
          ))}
        </div>

        <Link to={`/product/${item.productId}`}>
          <h3 className="text-[15px] font-medium text-foreground mb-[8px] line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-[18px] font-bold text-foreground">
            {formatPrice(Number(item.price || 0))}
          </span>

          <button
            onClick={() => onAddToCart(item)}
            className="w-[40px] h-[40px] bg-primary hover:bg-primary/90 rounded-[10px] flex items-center justify-center transition-colors shadow-lg shadow-blue-100 dark:shadow-none"
            title={t("product.addToCart")}
          >
            <ShoppingCart className="w-[18px] h-[18px] text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItemCard;
