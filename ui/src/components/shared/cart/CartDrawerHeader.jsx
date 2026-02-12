import { useTranslation } from "react-i18next";
import { ShoppingBag, X } from "lucide-react";

const CartDrawerHeader = ({ itemCount, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-[20px] border-b border-border">
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] bg-primary/10 rounded-[10px] flex items-center justify-center">
          <ShoppingBag className="w-[20px] h-[20px] text-primary" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-foreground">
            {t("basket.title")}
          </h2>
          <p className="text-[13px] text-muted-foreground">
            {itemCount} {t("basket.items")}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-[8px] hover:bg-accent hover:text-foreground text-muted-foreground rounded-[8px] transition-colors"
      >
        <X className="w-[22px] h-[22px]" />
      </button>
    </div>
  );
};

export default CartDrawerHeader;
