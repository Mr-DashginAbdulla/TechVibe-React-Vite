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
        <h2 className="text-[24px] font-bold text-[#111827] mb-[8px]">
          {t("checkout.step3")}
        </h2>
        <p className="text-[15px] text-[#6B7280]">
          {t("checkout.reviewOrder")}
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-[24px]">
        <h3 className="text-[18px] font-semibold text-[#111827] mb-[16px]">
          {t("order.items")} ({cartItems.length})
        </h3>
        <div className="space-y-[12px]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-[16px] p-[16px] bg-[#F9FAFB] rounded-[14px]"
            >
              <div className="w-[72px] h-[72px] bg-white rounded-[10px] overflow-hidden border border-[#E5E7EB] shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#111827] line-clamp-1">
                  {item.name}
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  {t("product.quantity")}: {item.quantity}
                </p>
              </div>
              <p className="text-[16px] font-bold text-[#3B82F6]">
                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[12px]">
          <h3 className="text-[18px] font-semibold text-[#111827]">
            {t("order.shippingAddress")}
          </h3>
          <button
            onClick={() => onChangeStep(1)}
            className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-[#3B82F6] hover:bg-blue-50 rounded-[8px] transition-colors"
          >
            <Edit2 className="w-[14px] h-[14px]" />
            {t("common.edit")}
          </button>
        </div>

        {selectedAddress ? (
          <div className="p-[20px] bg-[#F9FAFB] rounded-[16px] border border-[#E5E7EB]">
            <div className="flex items-start gap-[16px]">
              <div className="w-[44px] h-[44px] bg-white rounded-[10px] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                {selectedAddress.label === "Home" ? (
                  <Home className="w-[20px] h-[20px] text-[#6B7280]" />
                ) : (
                  <Building2 className="w-[20px] h-[20px] text-[#6B7280]" />
                )}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#111827]">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-[14px] text-[#6B7280] mt-[4px]">
                  {selectedAddress.address}
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.zipCode}
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  {selectedAddress.country}
                </p>
                <p className="text-[14px] text-[#6B7280] mt-[4px]">
                  📞 {selectedAddress.phone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-[20px] bg-red-50 rounded-[16px] border border-red-200 flex items-center gap-[12px]">
            <MapPin className="w-[20px] h-[20px] text-red-500" />
            <p className="text-[14px] text-red-600">
              {t("checkout.noAddressSelected")}
            </p>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div>
        <div className="flex items-center justify-between mb-[12px]">
          <h3 className="text-[18px] font-semibold text-[#111827]">
            {t("order.paymentMethod")}
          </h3>
          <button
            onClick={() => onChangeStep(2)}
            className="flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-[#3B82F6] hover:bg-blue-50 rounded-[8px] transition-colors"
          >
            <Edit2 className="w-[14px] h-[14px]" />
            {t("common.edit")}
          </button>
        </div>

        <div className="p-[20px] bg-[#F9FAFB] rounded-[16px] border border-[#E5E7EB]">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-[#3B82F6] rounded-[10px] flex items-center justify-center">
              <PaymentIcon className="w-[22px] h-[22px] text-white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827]">
                {t(`checkout.payment.${paymentMethod}`)}
              </p>
              <p className="text-[14px] text-[#6B7280]">
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
