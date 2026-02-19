import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { useClearCartMutation } from "@/store/api/productsApi";
import { orderService } from "@/services/orderService";

export const useCheckoutOrder = (
  user,
  checkoutItems,
  selectedAddress,
  paymentMethod,
  financials,
  orderParams,
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearCart] = useClearCartMutation();

  const { subtotal, shippingCost, tax, discount, promoCode, total } =
    financials;
  const { editOrderId, buyNowItem } = orderParams;

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

      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("checkout.orderError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handlePlaceOrder,
    isSubmitting,
  };
};
