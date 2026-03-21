import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const CartItemCard = ({ item, onQuantityChange, onRemove }) => {
  const { formatPrice } = useCurrency();
  return (
    <div className="flex gap-[16px] p-[20px] hover:bg-muted/50 transition-colors">
      <Link
        to={`/product/${item.productId}`}
        className="shrink-0 w-[80px] h-[80px] bg-muted rounded-[12px] overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.productId}`}
          className="text-[15px] font-semibold text-foreground hover:text-primary line-clamp-1 transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-[17px] font-bold text-primary mt-[4px]">
          {formatPrice(item.price || 0)}
        </p>
        <div className="flex items-center gap-[16px] mt-[10px]">
          <div className="flex items-center border border-border rounded-[8px]">
            <button
              onClick={() => onQuantityChange(item, (item.quantity || 1) - 1)}
              disabled={item.quantity <= 1}
              className="p-[8px] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-[8px]"
            >
              <Minus className="w-[14px] h-[14px] text-foreground" />
            </button>
            <span className="w-[40px] text-center text-[14px] font-semibold text-foreground">
              {item.quantity || 1}
            </span>
            <button
              onClick={() => onQuantityChange(item, (item.quantity || 1) + 1)}
              className="p-[8px] hover:bg-muted transition-colors rounded-r-[8px]"
            >
              <Plus className="w-[14px] h-[14px] text-foreground" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-[8px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[8px] transition-colors"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[16px] font-bold text-foreground">
          {formatPrice((item.price || 0) * (item.quantity || 1))}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
