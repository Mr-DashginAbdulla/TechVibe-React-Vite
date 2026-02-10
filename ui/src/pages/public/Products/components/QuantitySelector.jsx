import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const QuantitySelector = ({ quantity, setQuantity, stock }) => {
  const { t } = useTranslation();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  return (
    <div className="mb-6">
      <span className="block text-sm font-semibold text-foreground mb-3">
        {t("productDetails.quantity")}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-input rounded-xl bg-card">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-3 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-bold text-foreground">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="p-3 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
          >
            <Plus size={18} />
          </button>
        </div>
        <span className="text-sm text-muted-foreground">
          {stock} {t("productDetails.available")}
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;
