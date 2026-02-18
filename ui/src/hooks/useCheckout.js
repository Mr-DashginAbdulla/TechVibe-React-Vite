import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { useAuth } from "@/context/AuthContext";

import { useCheckoutAddress } from "./checkout/useCheckoutAddress";
import { useCheckoutCart } from "./checkout/useCheckoutCart";
import { useCheckoutOrder } from "./checkout/useCheckoutOrder";

export const useCheckout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const buyNowItem = location.state?.buyNowItem;
  const editOrderId = location.state?.editOrderId;
  const editOrderItems = location.state?.editOrderItems;

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // 1. Address Management
  const {
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    isLoading: isAddressLoading,
  } = useCheckoutAddress(user);

  // 2. Cart & Product Management
  const {
    checkoutItems,
    subtotal,
    shippingCost,
    tax,
    total,
    promoCode,
    discount,
    handleApplyPromo,
    handleUpdateQuantity,
    isLoading: isCartLoading,
    FREE_SHIPPING_THRESHOLD,
  } = useCheckoutCart(user, buyNowItem, editOrderItems);

  // 3. Order Placement
  const { handlePlaceOrder, isSubmitting } = useCheckoutOrder(
    user,
    checkoutItems,
    selectedAddress,
    paymentMethod,
    { subtotal, shippingCost, tax, discount, promoCode, total },
    { editOrderId, buyNowItem },
  );

  const isLoading = isAddressLoading || isCartLoading;

  // Auth Protection
  useEffect(() => {
    if (!user) {
      toast.error(t("basket.loginRequired"));
      navigate("/auth/login", { state: { from: "/checkout" } });
      return;
    }
  }, [user, navigate, t]);

  // Empty Cart Redirect
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

  // Step Validation
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

  return {
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
    isLoading,
    isSubmitting,
    checkoutItems,
    selectedAddress,
    subtotal,
    shippingCost,
    tax,
    total,
    canProceed,
    handleNext,
    handleBack,
    handleApplyPromo,
    handleUpdateQuantity,
    handlePlaceOrder,
    FREE_SHIPPING_THRESHOLD,
    user,
  };
};
