import { useTranslation } from "react-i18next";
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Edit2,
  Home,
  Building2,
} from "lucide-react";

const ReviewStep = ({
  cartItems,
  selectedAddress,
  paymentMethod,
  onChangeStep,
}) => {
  const { t } = useTranslation();

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "card":
        return CreditCard;
      case "cash":
        return Banknote;
      case "gpay":
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  const PaymentIcon = getPaymentIcon();

  return (
    <div>
      <div className="mb-[24px]">
        <h2 className="text-[24px] font-bold text-foreground mb-[8px]">
          {t("checkout.step3")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("checkout.reviewOrder")}
        </p>
      </div>

      <div className="mb-[24px]">
        <h3 className="text-[18px] font-semibold text-foreground mb-[16px]">
          {t("order.items")} ({cartItems.length})
        </h3>
        <div className="space-y-[12px]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-[16px] p-[16px] bg-muted/30 rounded-[14px]"
            >
              <div className="w-[72px] h-[72px] bg-card rounded-[10px] overflow-hidden border border-border shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground line-clamp-1">
                  {item.name}
                </p>
                <p className="text-[14px] text-muted-foreground">
                  {t("product.quantity")}: {item.quantity}
                </p>
              </div>
              <p className="text-[16px] font-bold text-primary">
                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[12px]">
          <h3 className="text-[18px] font-semibold text-foreground">
            {t("order.shippingAddress")}
          </h3>
          <button
            onClick={() => onChangeStep(1)}
            className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-primary hover:bg-primary/10 rounded-[8px] transition-colors"
          >
            <Edit2 className="w-[14px] h-[14px]" />
            {t("common.edit")}
          </button>
        </div>

        {selectedAddress ? (
          <div className="p-[20px] bg-muted/30 rounded-[16px] border border-border">
            <div className="flex items-start gap-[16px]">
              <div className="w-[44px] h-[44px] bg-card rounded-[10px] flex items-center justify-center border border-border shrink-0">
                {selectedAddress.label === "Home" ? (
                  <Home className="w-[20px] h-[20px] text-muted-foreground" />
                ) : (
                  <Building2 className="w-[20px] h-[20px] text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-[14px] text-muted-foreground mt-[4px]">
                  {selectedAddress.address}
                </p>
                <p className="text-[14px] text-muted-foreground">
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.zipCode}
                </p>
                <p className="text-[14px] text-muted-foreground">
                  {selectedAddress.country}
                </p>
                <p className="text-[14px] text-muted-foreground mt-[4px]">
                  📞 {selectedAddress.phone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-[20px] bg-destructive/10 rounded-[16px] border border-destructive/20 flex items-center gap-[12px]">
            <MapPin className="w-[20px] h-[20px] text-destructive" />
            <p className="text-[14px] text-destructive">
              {t("checkout.noAddressSelected")}
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-[12px]">
          <h3 className="text-[18px] font-semibold text-foreground">
            {t("order.paymentMethod")}
          </h3>
          <button
            onClick={() => onChangeStep(2)}
            className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-primary hover:bg-primary/10 rounded-[8px] transition-colors"
          >
            <Edit2 className="w-[14px] h-[14px]" />
            {t("common.edit")}
          </button>
        </div>

        <div className="p-[20px] bg-muted/30 rounded-[16px] border border-border">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-primary rounded-[10px] flex items-center justify-center">
              <PaymentIcon className="w-[22px] h-[22px] text-primary-foreground" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {t(`checkout.payment.${paymentMethod}`)}
              </p>
              <p className="text-[14px] text-muted-foreground">
                {t(`checkout.payment.${paymentMethod}Desc`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
