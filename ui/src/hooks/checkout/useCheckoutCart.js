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
  const total = subtotal + shippingCost - discount;

  // Promo Code Handler
  const handleApplyPromo = async (code) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/validate-promo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase(), subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.minOrder) {
          toast.error(
            t("checkout.minOrderRequired", { amount: data.minOrder }),
          );
        } else {
          toast.error(data.error || t("checkout.invalidPromo"));
        }
        return false;
      }

      setDiscount(data.discountAmount);
      setPromoCode(data.code);
      toast.success(t("checkout.promoApplied"));
      return true;
    } catch {
      toast.error(t("checkout.invalidPromo"));
      return false;
    }
  };

  // Remove Promo Code
  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
  };

  return {
    checkoutItems,
    localItems,
    setLocalItems,
    subtotal,
    shippingCost,
    total,
    promoCode,
    discount,
    setDiscount,
    handleApplyPromo,
    handleRemovePromo,
    handleUpdateQuantity,
    isLoading: isCartLoading,
    FREE_SHIPPING_THRESHOLD,
  };
};
