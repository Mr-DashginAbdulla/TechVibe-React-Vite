import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
  Plus,
  Minus,
} from "lucide-react";

const CheckoutSummary = ({
  cartItems,
  subtotal,
  shippingCost,
  freeShippingThreshold = 50,
  tax,
  discount,
  total,
  promoCode,
  onApplyPromo,
  onUpdateQuantity,
  currentStep,
}) => {
  const { t } = useTranslation();
  const [inputCode, setInputCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!inputCode.trim()) return;
    setIsApplying(true);
    const success = await onApplyPromo(inputCode.trim());
    if (success) {
      setInputCode("");
    }
    setIsApplying(false);
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E7EB] p-[24px] sticky top-[24px]">
      <h3 className="text-[20px] font-bold text-[#111827] mb-[20px]">
        {t("basket.orderSummary")}
      </h3>

      {/* Cart Items Preview */}
      <div className="space-y-[12px] mb-[20px] max-h-[240px] overflow-y-auto">
        {cartItems.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-[12px]">
            <div className="w-[56px] h-[56px] bg-[#F9FAFB] rounded-[8px] overflow-hidden border border-[#E5E7EB] shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111827] line-clamp-1">
                {item.name}
              </p>
              {/* Display selected options (color, memory, etc.) */}
              {item.selectedOptions &&
                Object.keys(item.selectedOptions).length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mt-[4px]">
                    {Object.entries(item.selectedOptions).map(
                      ([key, value]) => {
                        if (!value) return null;
                        const displayValue =
                          value.label || value.value || value;
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-[4px] px-[6px] py-[2px] bg-[#F3F4F6] rounded-[4px] text-[11px] text-[#6B7280]"
                          >
                            {key === "color" && value.value && (
                              <span
                                className="w-[10px] h-[10px] rounded-full border border-gray-300"
                                style={{ backgroundColor: value.value }}
                              />
                            )}
                            {displayValue}
                          </span>
                        );
                      },
                    )}
                  </div>
                )}
              {/* Quantity controls */}
              <div className="flex items-center gap-[8px] mt-[4px]">
                {onUpdateQuantity ? (
                  <div className="flex items-center gap-[4px]">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item,
                          Math.max(1, (item.quantity || 1) - 1),
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="w-[22px] h-[22px] flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[4px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-[12px] h-[12px] text-[#6B7280]" />
                    </button>
                    <span className="text-[12px] font-medium text-[#374151] min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item, (item.quantity || 1) + 1)
                      }
                      disabled={item.quantity >= (item.stock || 99)}
                      className="w-[22px] h-[22px] flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[4px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-[12px] h-[12px] text-[#6B7280]" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-[#6B7280]">x{item.quantity}</p>
                )}
              </div>
            </div>
            <p className="text-[14px] font-semibold text-[#111827]">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#E5E7EB] my-[16px]" />

      {/* Promo Code */}
      {currentStep >= 3 && (
        <div className="mb-[16px]">
          <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
            {t("checkout.promoCode")}
          </label>
          {promoCode ? (
            <div className="flex items-center justify-between p-[12px] bg-emerald-50 rounded-[10px] border border-emerald-200">
              <div className="flex items-center gap-[8px]">
                <Tag className="w-[16px] h-[16px] text-emerald-600" />
                <span className="text-[14px] font-semibold text-emerald-700">
                  {promoCode}
                </span>
              </div>
              <span className="text-[14px] font-bold text-emerald-600">
                -${discount.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex gap-[8px]">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder={t("checkout.enterCode")}
                className="flex-1 px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                onClick={handleApply}
                disabled={isApplying || !inputCode.trim()}
                className="px-[16px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-[14px] rounded-[10px] transition-colors disabled:opacity-50"
              >
                {isApplying ? "..." : t("checkout.apply")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-[12px]">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">
            {t("basket.subtotal")} ({cartItems.length} {t("basket.items")})
          </span>
          <span className="text-[#111827] font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">{t("basket.shipping")}</span>
          {shippingCost === 0 ? (
            <span className="text-emerald-600 font-medium">
              {t("checkout.freeShipping")}
            </span>
          ) : (
            <span className="text-[#111827] font-medium">
              ${shippingCost.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">{t("checkout.tax")} (18%)</span>
          <span className="text-[#111827] font-medium">${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[14px]">
            <span className="text-emerald-600">{t("checkout.discount")}</span>
            <span className="text-emerald-600 font-medium">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="h-px bg-[#E5E7EB]" />

        <div className="flex justify-between text-[18px] font-bold">
          <span className="text-[#111827]">{t("basket.total")}</span>
          <span className="text-[#3B82F6]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-[24px] pt-[20px] border-t border-[#E5E7EB] space-y-[12px]">
        <div className="flex items-center gap-[10px] text-[13px] text-[#6B7280]">
          <ShieldCheck className="w-[18px] h-[18px] text-emerald-500" />
          {t("checkout.secureCheckout")}
        </div>
        <div className="flex items-center gap-[10px] text-[13px] text-[#6B7280]">
          <Truck className="w-[18px] h-[18px] text-emerald-500" />
          {t("checkout.freeShippingOver")}
        </div>
        <div className="flex items-center gap-[10px] text-[13px] text-[#6B7280]">
          <RotateCcw className="w-[18px] h-[18px] text-emerald-500" />
          {t("checkout.returnPolicy")}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
