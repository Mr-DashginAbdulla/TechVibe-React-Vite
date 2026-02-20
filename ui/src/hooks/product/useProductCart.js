import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast as toast } from "@/components/shared/StyledToast";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
} from "@/store/api/productsApi";

export const useProductCart = (
  user,
  product,
  calculatedPrice,
  selectedOptions,
) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const handleAddToCart = async (t) => {
    if (!user) {
      toast.error(t("messages.loginToAddToCart"));
      return;
    }

    try {
      const existingItem = cartItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        const newQuantity = Math.min(
          (existingItem.quantity || 1) + quantity,
          product.stock,
        );
        await updateCartItem({
          id: existingItem.id,
          quantity: newQuantity,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        await addToCart({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: calculatedPrice,
          image: product.image,
          quantity,
          stock: product.stock,
          selectedOptions,
        }).unwrap();
        toast.success(t("productDetails.addedToCart"));
      }
    } catch (error) {
      toast.error(t("messages.failedToAddToCart"));
    }
  };

  const handleBuyNow = (t) => {
    if (!user) {
      toast.error(t("messages.loginRequired"));
      return;
    }

    const buyNowItem = {
      productId: product.id,
      name: product.name,
      price: calculatedPrice,
      image: product.image,
      quantity,
      stock: product.stock,
      selectedOptions,
    };

    navigate("/checkout", { state: { buyNowItem } });
  };

  const handleRelatedAddToCart = (prod, t) => {
    if (!user) {
      toast.error(t("messages.loginToAddToCart"));
      return;
    }
    addToCart({
      userId: user.id,
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1,
      selectedOptions: {},
    });
    toast.success(t("productDetails.addedToCart"));
  };

  return {
    quantity,
    setQuantity,
    cartItems,
    handleAddToCart,
    handleBuyNow,
    handleRelatedAddToCart,
  };
};
