import { useTranslation } from "react-i18next";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "card", icon: CreditCard, color: "blue" },
  { id: "cash", icon: Banknote, color: "emerald" },
  { id: "gpay", icon: Smartphone, color: "purple" },
];

const PaymentStep = ({
  paymentMethod,
  onPaymentMethodChange,
  cardDetails,
  onCardDetailsChange,
}) => {
  const { t } = useTranslation();

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div>
      <div className="mb-[24px]">
        <h2 className="text-[24px] font-bold text-[#111827] mb-[8px]">
          {t("checkout.step2")}
        </h2>
        <p className="text-[15px] text-[#6B7280]">
          {t("checkout.selectPayment")}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-[12px] mb-[32px]">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              className={`p-[20px] rounded-[16px] border-2 cursor-pointer transition-all flex items-center gap-[16px] ${
                isSelected
                  ? `border-[#3B82F6] bg-blue-50/50`
                  : "border-[#E5E7EB] hover:border-[#3B82F6]/50"
              }`}
            >
              <div
                className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center ${
                  isSelected ? "bg-[#3B82F6]" : "bg-[#F3F4F6]"
                }`}
              >
                <Icon
                  className={`w-[24px] h-[24px] ${
                    isSelected ? "text-white" : "text-[#6B7280]"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-semibold text-[#111827]">
                  {t(`checkout.payment.${method.id}`)}
                </p>
                <p className="text-[14px] text-[#6B7280]">
                  {t(`checkout.payment.${method.id}Desc`)}
                </p>
              </div>
              <div
                className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? "border-[#3B82F6] bg-[#3B82F6]"
                    : "border-[#D1D5DB]"
                }`}
              >
                {isSelected && (
                  <div className="w-[10px] h-[10px] rounded-full bg-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Details Form */}
      {paymentMethod === "card" && (
        <div className="bg-[#F9FAFB] rounded-[20px] p-[24px] space-y-[20px]">
          <h3 className="text-[18px] font-semibold text-[#111827]">
            {t("checkout.cardDetails")}
          </h3>

          {/* Card Preview */}
          <div className="bg-linear-to-br from-[#1E3A8A] to-[#3B82F6] rounded-[16px] p-[24px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full -mr-[100px] -mt-[100px]" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-white/5 rounded-full -ml-[75px] -mb-[75px]" />

            <div className="flex justify-between items-start mb-[32px]">
              <div className="w-[50px] h-[40px] bg-linear-to-br from-yellow-400 to-yellow-600 rounded-[8px]" />
              <CreditCard className="w-[32px] h-[32px] opacity-80" />
            </div>

            <p className="text-[22px] font-mono tracking-[4px] mb-[24px]">
              {cardDetails.cardNumber || "•••• •••• •••• ••••"}
            </p>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] uppercase opacity-60 mb-[4px]">
                  {t("checkout.cardHolder")}
                </p>
                <p className="text-[14px] font-medium tracking-wide">
                  {cardDetails.cardName || t("checkout.yourName")}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase opacity-60 mb-[4px]">
                  {t("checkout.expires")}
                </p>
                <p className="text-[14px] font-medium">
                  {cardDetails.expiry || t("checkout.mmyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div className="space-y-[16px]">
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("checkout.cardNumber")}
              </label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  onCardDetailsChange({
                    ...cardDetails,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-[16px] py-[14px] border border-[#E5E7EB] rounded-[12px] text-[16px] font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("checkout.cardName")}
              </label>
              <input
                type="text"
                value={cardDetails.cardName}
                onChange={(e) =>
                  onCardDetailsChange({
                    ...cardDetails,
                    cardName: e.target.value.toUpperCase(),
                  })
                }
                placeholder={t("checkout.cardHolderPlaceholder")}
                className="w-full px-[16px] py-[14px] border border-[#E5E7EB] rounded-[12px] text-[16px] uppercase focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("checkout.expiry")}
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    onCardDetailsChange({
                      ...cardDetails,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                  placeholder={t("checkout.mmyy")}
                  maxLength={5}
                  className="w-full px-[16px] py-[14px] border border-[#E5E7EB] rounded-[12px] text-[16px] font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("checkout.cvv")}
                </label>
                <input
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    onCardDetailsChange({
                      ...cardDetails,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-[16px] py-[14px] border border-[#E5E7EB] rounded-[12px] text-[16px] font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                />
              </div>
            </div>
          </div>

          <p className="text-[13px] text-[#6B7280] text-center">
            {t("checkout.cardSecureNote")}
          </p>
        </div>
      )}

      {/* Cash on Delivery info */}
      {paymentMethod === "cash" && (
        <div className="bg-emerald-50 rounded-[20px] p-[24px] border border-emerald-200">
          <div className="flex items-start gap-[16px]">
            <div className="w-[48px] h-[48px] bg-emerald-100 rounded-[12px] flex items-center justify-center shrink-0">
              <Banknote className="w-[24px] h-[24px] text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-emerald-800 mb-[8px]">
                {t("checkout.payment.cash")}
              </h3>
              <p className="text-[14px] text-emerald-700">
                {t("checkout.cashNote")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Google Pay info */}
      {paymentMethod === "gpay" && (
        <div className="bg-purple-50 rounded-[20px] p-[24px] border border-purple-200">
          <div className="flex items-start gap-[16px]">
            <div className="w-[48px] h-[48px] bg-purple-100 rounded-[12px] flex items-center justify-center shrink-0">
              <Smartphone className="w-[24px] h-[24px] text-purple-600" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-purple-800 mb-[8px]">
                {t("checkout.payment.gpay")}
              </h3>
              <p className="text-[14px] text-purple-700">
                {t("checkout.gpayNote")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
