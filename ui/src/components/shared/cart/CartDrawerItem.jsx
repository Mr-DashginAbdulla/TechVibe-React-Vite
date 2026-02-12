import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartDrawerItem = ({
  item,
  onClose,
  onQuantityChange,
  onRemove,
  maxStock,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-[12px] p-[12px] bg-card rounded-[14px] border border-border hover:border-primary/20 transition-colors">
      <Link
        to={`/product/${item.productId}`}
        onClick={onClose}
        className="shrink-0 w-[72px] h-[72px] bg-background rounded-[10px] overflow-hidden border border-border"
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
          onClick={onClose}
          className="text-[14px] font-semibold text-foreground hover:text-primary line-clamp-2 transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-[15px] font-bold text-primary mt-[4px]">
          ${(item.price || 0).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-[8px]">
          <div className="flex items-center border border-border rounded-[8px] bg-background">
            <button
              onClick={() => onQuantityChange(item, (item.quantity || 1) - 1)}
              disabled={item.quantity <= 1}
              className="p-[6px] hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-[8px] text-foreground"
            >
              <Minus className="w-[14px] h-[14px]" />
            </button>
            <span className="w-[32px] text-center text-[13px] font-semibold text-foreground">
              {item.quantity || 1}
            </span>
            <button
              onClick={() => onQuantityChange(item, (item.quantity || 1) + 1)}
              disabled={item.quantity >= maxStock}
              className="p-[6px] hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-r-[8px] text-foreground"
            >
              <Plus className="w-[14px] h-[14px]" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="p-[6px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[6px] transition-colors"
          >
            <Trash2 className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawerItem;
