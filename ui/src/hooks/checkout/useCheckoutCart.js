import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import {
  useGetCartQuery,
  useGetAllProductsQuery,
} from "@/store/api/productsApi";

const SHIPPING_COST = 5.0;
const FREE_SHIPPING_THRESHOLD = 50;

export const useCheckoutCart = (user, buyNowItem, editOrderItems) => {
  const { t } = useTranslation();
  const [localItems, setLocalItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Cart Data
  const { data: cartItems = [], isLoading: isCartLoading } = useGetCartQuery(
    user?.id,
    {
      skip: !user?.id || !!buyNowItem,
    },
  );

  // Products Data
  const { data: allProducts = [] } = useGetAllProductsQuery();

  const itemsInitialized = useRef(false);

  // Initialize Items (only once when source data becomes available)
  useEffect(() => {
    if (itemsInitialized.current) return;

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
      itemsInitialized.current = true;
    } else if (items.length > 0) {
      setLocalItems(items);
      itemsInitialized.current = true;
    }
  }, [buyNowItem, editOrderItems, cartItems, allProducts]);

  const checkoutItems = localItems;

  // Quantity Update Handler
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

  // Calculations
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax - discount;

  // Promo Code Handler
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

  return {
    checkoutItems,
    localItems,
    setLocalItems,
    subtotal,
    shippingCost,
    tax,
    total,
    promoCode,
    discount,
    setDiscount,
    handleApplyPromo,
    handleUpdateQuantity,
    isLoading: isCartLoading,
    FREE_SHIPPING_THRESHOLD,
  };
};
