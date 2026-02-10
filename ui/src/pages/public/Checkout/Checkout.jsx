import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  useGetCartQuery,
  useClearCartMutation,
  useGetAllProductsQuery,
} from "@/store/api/productsApi";
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

const SHIPPING_COST = 5.0;
const FREE_SHIPPING_THRESHOLD = 50;

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const buyNowItem = location.state?.buyNowItem;

  const editOrderId = location.state?.editOrderId;
  const editOrderItems = location.state?.editOrderItems;

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
    skip: !user?.id || !!buyNowItem,
  });
  const [clearCart] = useClearCartMutation();

  const [localItems, setLocalItems] = useState([]);

  const { data: allProducts = [] } = useGetAllProductsQuery();

  useEffect(() => {
    let items = [];
    if (buyNowItem) {
      items = [buyNowItem];
    } else if (editOrderItems) {
      items = editOrderItems;
    } else if (cartItems.length > 0) {
      items = cartItems;
    }

    if (items.length > 0 && allProducts.length > 0) {
      const itemsWithStock = items.map((item) => {
        const product = allProducts.find(
          (p) => p.id === item.productId || p.id === String(item.productId),
        );
        return {
          ...item,
          stock: product?.stock || item.stock || 99,
        };
      });
      setLocalItems(itemsWithStock);
    } else if (items.length > 0) {
      setLocalItems(items);
    }
  }, [buyNowItem, editOrderItems, cartItems, allProducts]);

  const checkoutItems = localItems;

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;

    const maxQuantity = item.stock || 99;
    if (newQuantity > maxQuantity) return;

    setLocalItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id || i.productId === item.productId
          ? { ...i, quantity: newQuantity }
          : i,
      ),
    );
  };

  useEffect(() => {
    if (!user) {
      toast.error(t("basket.loginRequired"));
      navigate("/auth/login", { state: { from: "/checkout" } });
      return;
    }
  }, [user, navigate, t]);

  useEffect(() => {
    if (
      checkoutItems.length === 0 &&
      !isLoading &&
      !buyNowItem &&
      !editOrderItems
    ) {
      toast.error(t("basket.emptyCartError"));
      navigate("/");
    }
  }, [checkoutItems, isLoading, buyNowItem, editOrderItems, navigate, t]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      try {
        const data = await addressService.getByUserId(user.id);
        setAddresses(data);

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

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax - discount;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

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
    if (!selectedAddress || checkoutItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedOptions: item.selectedOptions || {},
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
        shippingCost: shippingCost,
        tax: tax,
        discount: discount,
        promoCode: promoCode || null,
        total: total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      let order;
      if (editOrderId) {
        order = await orderService.updateOrderItems(
          editOrderId,
          orderData.items,
        );
        toast.success(t("checkout.orderUpdated"));
      } else {
        order = await orderService.create(orderData);
        toast.success(t("checkout.orderPlaced"));
      }

      if (!buyNowItem && !editOrderId) {
        await clearCart(user.id);
      }

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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("checkout.title")} - TechVibe</title>
      </Helmet>

      <div className="max-w-[1280px] mx-auto px-[16px] py-[32px]">
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
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${
                        isCurrent
                          ? "bg-primary-foreground/20"
                          : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-muted-foreground/20"
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
                        currentStep > step.id ? "bg-emerald-400" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

              <div className="flex justify-between mt-[32px] pt-[24px] border-t border-border">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-[8px] px-[24px] py-[14px] rounded-[12px] font-semibold transition-colors ${
                    currentStep === 1
                      ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted text-foreground hover:bg-muted/80"
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
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground/50 cursor-not-allowed"
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

            <div className="flex items-center justify-center gap-[32px] mt-[24px]">
              <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
                <ShieldCheck className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.secureCheckout")}
              </div>
              <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
                <Lock className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.sslEncrypted")}
              </div>
              <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
                <Truck className="w-[18px] h-[18px] text-emerald-500" />
                {t("checkout.fastDelivery")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={checkoutItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
              tax={tax}
              discount={discount}
              total={total}
              promoCode={promoCode}
              onApplyPromo={handleApplyPromo}
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
