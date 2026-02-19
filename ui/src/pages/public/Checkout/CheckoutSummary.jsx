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
    <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px] sticky top-[24px]">
      <h3 className="text-[20px] font-bold text-foreground mb-[20px]">
        {t("basket.orderSummary")}
      </h3>

      <div className="space-y-[12px] mb-[20px] max-h-[240px] overflow-y-auto">
        {cartItems.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-[12px]">
            <div className="w-[56px] h-[56px] bg-background rounded-[8px] overflow-hidden border border-border shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground line-clamp-1">
                {item.name}
              </p>

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
                            className="inline-flex items-center gap-[4px] px-[6px] py-[2px] bg-accent rounded-[4px] text-[11px] text-muted-foreground"
                          >
                            {key === "color" && value.value && (
                              <span
                                className="w-[10px] h-[10px] rounded-full border border-border"
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
                      className="w-[22px] h-[22px] flex items-center justify-center bg-muted hover:bg-muted/80 rounded-[4px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-[12px] h-[12px] text-muted-foreground" />
                    </button>
                    <span className="text-[12px] font-medium text-foreground min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item, (item.quantity || 1) + 1)
                      }
                      disabled={item.quantity >= (item.stock || 99)}
                      className="w-[22px] h-[22px] flex items-center justify-center bg-muted hover:bg-muted/80 rounded-[4px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-[12px] h-[12px] text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-muted-foreground">
                    x{item.quantity}
                  </p>
                )}
              </div>
            </div>
            <p className="text-[14px] font-semibold text-foreground">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-border my-[16px]" />

      {currentStep >= 3 && (
        <div className="mb-[16px]">
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("checkout.promoCode")}
          </label>
          {promoCode ? (
            <div className="flex items-center justify-between p-[12px] bg-success/10 rounded-[10px] border border-success/20">
              <div className="flex items-center gap-[8px]">
                <Tag className="w-[16px] h-[16px] text-success" />
                <span className="text-[14px] font-semibold text-success">
                  {promoCode}
                </span>
              </div>
              <span className="text-[14px] font-bold text-success">
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
                className="flex-1 px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleApply}
                disabled={isApplying || !inputCode.trim()}
                className="px-[16px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[14px] rounded-[10px] transition-colors disabled:opacity-50"
              >
                {isApplying ? "..." : t("checkout.apply")}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-[12px]">
        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">
            {t("basket.subtotal")} ({cartItems.length} {t("basket.items")})
          </span>
          <span className="text-foreground font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">{t("basket.shipping")}</span>
          {shippingCost === 0 ? (
            <span className="text-success font-medium">
              {t("checkout.freeShipping")}
            </span>
          ) : (
            <span className="text-foreground font-medium">
              ${shippingCost.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-muted-foreground">
            {t("checkout.tax")} (18%)
          </span>
          <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[14px]">
            <span className="text-success">{t("checkout.discount")}</span>
            <span className="text-success font-medium">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="flex justify-between text-[18px] font-bold">
          <span className="text-foreground">{t("basket.total")}</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-[24px] pt-[20px] border-t border-border space-y-[12px]">
        <div className="flex items-center gap-[10px] text-[13px] text-muted-foreground">
          <ShieldCheck className="w-[18px] h-[18px] text-success" />
          {t("checkout.secureCheckout")}
        </div>
        <div className="flex items-center gap-[10px] text-[13px] text-muted-foreground">
          <Truck className="w-[18px] h-[18px] text-success" />
          {t("checkout.freeShippingOver")}
        </div>
        <div className="flex items-center gap-[10px] text-[13px] text-muted-foreground">
          <RotateCcw className="w-[18px] h-[18px] text-success" />
          {t("checkout.returnPolicy")}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
