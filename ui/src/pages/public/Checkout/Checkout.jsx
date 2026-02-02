import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGetCartQuery, useClearCartMutation } from "@/store/api/productsApi";
import { addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import CheckoutSummary from "./CheckoutSummary";

const STEPS = [
  { id: 1, key: "shipping", icon: MapPin },
  { id: 2, key: "payment", icon: CreditCard },
  { id: 3, key: "review", icon: ClipboardCheck },
];

const SHIPPING_COST = 5.0; // Sabit çatdırılma qiyməti

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });
  const [clearCart] = useClearCartMutation();

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      toast.error(t("basket.loginRequired"));
      navigate("/auth/login", { state: { from: "/checkout" } });
      return;
    }
  }, [user, navigate, t]);

  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      toast.error(t("basket.emptyCartError"));
      navigate("/");
    }
  }, [cartItems, isLoading, navigate, t]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      try {
        const data = await addressService.getByUserId(user.id);
        setAddresses(data);
        // Auto-select default address
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.id]);

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const tax = subtotal * 0.18; // 18% ƏDV
  const total = subtotal + SHIPPING_COST + tax - discount;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // Step validation
  const canProceed = () => {
    if (currentStep === 1) {
      return selectedAddressId !== null;
    }
    if (currentStep === 2) {
      if (paymentMethod === "card") {
        return (
          cardDetails.cardNumber.replace(/\s/g, "").length >= 16 &&
          cardDetails.cardName.length > 2 &&
          cardDetails.expiry.length >= 5 &&
          cardDetails.cvv.length >= 3
        );
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplyPromo = async (code) => {
    // Simulate promo code validation
    const promoCodes = {
      STUDENT10: { discount: 10, type: "percentage", minOrder: 50 },
      SAVE20: { discount: 20, type: "fixed", minOrder: 100 },
    };

    const promo = promoCodes[code.toUpperCase()];
    if (promo) {
      if (subtotal >= promo.minOrder) {
        const discountAmount =
          promo.type === "percentage"
            ? (subtotal * promo.discount) / 100
            : promo.discount;
        setDiscount(discountAmount);
        setPromoCode(code.toUpperCase());
        toast.success(t("checkout.promoApplied"));
        return true;
      } else {
        toast.error(t("checkout.minOrderRequired", { amount: promo.minOrder }));
        return false;
      }
    } else {
      toast.error(t("checkout.invalidPromo"));
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          label: selectedAddress.label,
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        },
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shippingCost: SHIPPING_COST,
        tax: tax,
        discount: discount,
        promoCode: promoCode || null,
        total: total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      const order = await orderService.create(orderData);

      // Clear cart
      await clearCart(user.id);

      toast.success(t("checkout.orderPlaced"));
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("checkout.orderError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Helmet>
        <title>{t("checkout.title")} - TechVibe</title>
      </Helmet>

      <div className="max-w-[1280px] mx-auto px-[16px] py-[32px]">
        {/* Stepper */}
        <div className="mb-[40px]">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-[12px] px-[20px] py-[12px] rounded-[16px] transition-all ${
                      isCurrent
                        ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/25"
                        : isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    <div
                      className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${
                        isCurrent
                          ? "bg-white/20"
                          : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-[#E5E7EB]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-[16px] h-[16px]" />
                      ) : (
                        <Icon className="w-[16px] h-[16px]" />
                      )}
                    </div>
                    <span className="font-semibold text-[14px]">
                      {t(`checkout.step${step.id}`)}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-[60px] h-[3px] mx-[8px] rounded-full ${
                        currentStep > step.id
                          ? "bg-emerald-400"
                          : "bg-[#E5E7EB]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
          {/* Left - Step Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E7EB] p-[32px]">
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
                  cartItems={cartItems}
                  selectedAddress={selectedAddress}
                  paymentMethod={paymentMethod}
                  onChangeStep={setCurrentStep}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-[32px] pt-[24px] border-t border-[#E5E7EB]">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-[8px] px-[24px] py-[14px] rounded-[12px] font-semibold transition-colors ${
                    currentStep === 1
                      ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                      : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                  }`}
                >
                  <ArrowLeft className="w-[18px] h-[18px]" />
                  {t("common.back")}
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-[8px] px-[24px] py-[14px] rounded-[12px] font-semibold transition-colors ${
                      canProceed()
                        ? "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                        : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    }`}
                  >
                    {t("common.next")}
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex items-center gap-[8px] px-[32px] py-[14px] bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-[12px] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">
                        {t("common.loading")}
                      </span>
                    ) : (
                      <>
                        <Check className="w-[18px] h-[18px]" />
                        {t("checkout.placeOrder")}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-[32px] mt-[24px]">
              <div className="flex items-center gap-[8px] text-[13px] text-[#6B7280]">
                <ShieldCheck className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.secureCheckout")}
              </div>
              <div className="flex items-center gap-[8px] text-[13px] text-[#6B7280]">
                <Lock className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.sslEncrypted")}
              </div>
              <div className="flex items-center gap-[8px] text-[13px] text-[#6B7280]">
                <Truck className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.fastDelivery")}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCost={SHIPPING_COST}
              tax={tax}
              discount={discount}
              total={total}
              promoCode={promoCode}
              onApplyPromo={handleApplyPromo}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
