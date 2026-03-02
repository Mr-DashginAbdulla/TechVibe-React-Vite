import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetAllProductsQuery,
} from "@/store/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { useLenisContext } from "@/context/LenisProvider";
import CartDrawerHeader from "./cart/CartDrawerHeader";
import CartDrawerItem from "./cart/CartDrawerItem";
import CartDrawerFooter from "./cart/CartDrawerFooter";
import { CartLoginPrompt, CartEmptyState } from "./cart/CartEmptyStates";

const CartDrawer = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const lenis = useLenisContext();

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const { data: allProducts = [] } = useGetAllProductsQuery();

  const getProductStock = (productId) => {
    const product = allProducts.find(
      (p) => p.id === productId || p.id === String(productId),
    );
    return product?.stock || 99;
  };

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [isOpen, onClose, lenis]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    const maxQuantity = getProductStock(item.productId);
    if (newQuantity > maxQuantity) {
      toast.error(t("basket.stockLimitReached"));
      return;
    }
    try {
      await updateCartItem({ id: item.id, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast.error(t("basket.updateError"));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId).unwrap();
      toast.success(t("basket.itemRemoved"));
    } catch (error) {
      toast.error(t("basket.removeError"));
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/profile/cart");
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-card z-70 shadow-2xl border-l border-border"
          >
            <CartDrawerHeader itemCount={cartItems.length} onClose={onClose} />

            <div className="flex flex-col h-[calc(100%-80px)]">
              {!user ? (
                <CartLoginPrompt onClose={onClose} />
              ) : cartItems.length === 0 ? (
                <CartEmptyState
                  onClose={onClose}
                  onStartShopping={() => {
                    onClose();
                    navigate("/");
                  }}
                />
              ) : (
                <>
                  <div
                    className="flex-1 overflow-y-auto p-[16px] space-y-[12px]"
                    style={{
                      overscrollBehavior: "contain",
                      scrollBehavior: "smooth",
                    }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {cartItems.map((item) => (
                      <CartDrawerItem
                        key={item.id}
                        item={item}
                        onClose={onClose}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        maxStock={getProductStock(item.productId)}
                      />
                    ))}
                  </div>

                  <CartDrawerFooter
                    subtotal={subtotal}
                    onCheckout={handleCheckout}
                    onViewCart={handleViewCart}
                  />
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CartDrawer;
