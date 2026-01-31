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
      <span className="block text-sm font-semibold text-gray-900 mb-3">
        {t("productDetails.quantity")}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl bg-white">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-3 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-bold text-gray-900">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="p-3 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {stock} {t("productDetails.available")}
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;
