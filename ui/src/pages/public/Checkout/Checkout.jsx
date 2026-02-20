import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { MapPin, CreditCard, ClipboardCheck } from "lucide-react";

import { useCheckout } from "@/hooks/useCheckout"; // Import new hook
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutSteps from "./CheckoutSteps"; // Import new component
import CheckoutNavigation from "./CheckoutNavigation"; // Import new component
import TrustBadges from "./TrustBadges"; // Import new component

const STEPS = [
  { id: 1, key: "shipping", icon: MapPin },
  { id: 2, key: "payment", icon: CreditCard },
  { id: 3, key: "review", icon: ClipboardCheck },
];

const Checkout = () => {
  const { t } = useTranslation();

  const {
    currentStep,
    setCurrentStep,
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    promoCode,
    discount,
    isSubmitting,
    checkoutItems,
    selectedAddress,
    subtotal,
    shippingCost,
    total,
    canProceed,
    handleNext,
    handleBack,
    handleApplyPromo,
    handleRemovePromo,
    handleUpdateQuantity,
    handlePlaceOrder,
    FREE_SHIPPING_THRESHOLD,
    user,
  } = useCheckout();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("checkout.title")} - TechVibe</title>
      </Helmet>

      <div className="max-w-[1280px] mx-auto px-[16px] py-[32px]">
        <CheckoutSteps steps={STEPS} currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-[24px] shadow-sm border border-border p-[32px]">
              {currentStep === 1 && (
                <ShippingStep
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  onAddressAdded={(newAddr) => {
                    setAddresses([...addresses, newAddr]);
                    setSelectedAddressId(newAddr.id);
                  }}
                  userId={user?.id}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  cardDetails={cardDetails}
                  onCardDetailsChange={setCardDetails}
                />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  cartItems={checkoutItems}
                  selectedAddress={selectedAddress}
                  paymentMethod={paymentMethod}
                  onChangeStep={setCurrentStep}
                />
              )}

              <CheckoutNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
                handleBack={handleBack}
                handleNext={handleNext}
                handlePlaceOrder={handlePlaceOrder}
                canProceed={canProceed}
                isSubmitting={isSubmitting}
              />
            </div>

            <TrustBadges />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={checkoutItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
              discount={discount}
              total={total}
              promoCode={promoCode}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              onUpdateQuantity={handleUpdateQuantity}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
