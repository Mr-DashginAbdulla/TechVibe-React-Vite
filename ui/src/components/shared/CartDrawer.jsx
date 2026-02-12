import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetAllProductsQuery,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";
import { useLenisContext } from "@/context/LenisProvider";

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
            className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white dark:bg-[#111827] z-70 shadow-2xl border-l border-border"
          >
            <div className="flex items-center justify-between p-[20px] border-b border-border">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] bg-primary/10 rounded-[10px] flex items-center justify-center">
                  <ShoppingBag className="w-[20px] h-[20px] text-primary" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-foreground">
                    {t("basket.title")}
                  </h2>
                  <p className="text-[13px] text-muted-foreground">
                    {cartItems.length} {t("basket.items")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-[8px] hover:bg-accent hover:text-foreground text-muted-foreground rounded-[8px] transition-colors"
              >
                <X className="w-[22px] h-[22px]" />
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-80px)]">
              {!user ? (
                <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
                  <div className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center mb-[16px]">
                    <ShoppingBag className="w-[36px] h-[36px] text-primary" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
                    {t("basket.loginRequired")}
                  </h3>
                  <p className="text-[14px] text-muted-foreground text-center mb-[20px]">
                    {t("basket.loginRequiredDesc")}
                  </p>
                  <Link
                    to="/auth/login"
                    onClick={onClose}
                    className="px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
                  >
                    {t("auth.signIn")}
                  </Link>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
                  <div className="relative mb-[20px]">
                    <div className="w-[100px] h-[100px] bg-linear-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-[44px] h-[44px] text-primary" />
                    </div>
                    <div className="absolute -bottom-[4px] -right-[4px] w-[36px] h-[36px] bg-muted rounded-full flex items-center justify-center">
                      <span className="text-[18px]">😢</span>
                    </div>
                  </div>
                  <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
                    {t("basket.emptyTitle")}
                  </h3>
                  <p className="text-[14px] text-muted-foreground text-center mb-[20px]">
                    {t("basket.emptyDesc")}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/");
                    }}
                    className="flex items-center gap-[8px] px-[24px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
                  >
                    {t("basket.startShopping")}
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </button>
                </div>
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
                      <div
                        key={item.id}
                        className="flex gap-[12px] p-[12px] bg-card rounded-[14px] border border-border hover:border-primary/20 transition-colors"
                      >
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={onClose}
                          className="shrink-0 w-[72px] h-[72px] bg-background rounded-[10px] overflow-hidden border border-border"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={onClose}
                            className="text-[14px] font-semibold text-foreground hover:text-primary line-clamp-2 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[15px] font-bold text-primary mt-[4px]">
                            ${(item.price || 0).toFixed(2)}
                          </p>
                          <div className="flex items-center justify-between mt-[8px]">
                            <div className="flex items-center border border-border rounded-[8px] bg-background">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    (item.quantity || 1) - 1,
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-[6px] hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-[8px] text-foreground"
                              >
                                <Minus className="w-[14px] h-[14px]" />
                              </button>
                              <span className="w-[32px] text-center text-[13px] font-semibold text-foreground">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    (item.quantity || 1) + 1,
                                  )
                                }
                                disabled={
                                  item.quantity >=
                                  getProductStock(item.productId)
                                }
                                className="p-[6px] hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-r-[8px] text-foreground"
                              >
                                <Plus className="w-[14px] h-[14px]" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-[6px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[6px] transition-colors"
                            >
                              <Trash2 className="w-[16px] h-[16px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-[16px] border-t border-border bg-muted/30">
                    <div className="space-y-[8px] mb-[16px]">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-muted-foreground">
                          {t("basket.subtotal")}
                        </span>
                        <span className="text-foreground font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-muted-foreground">
                          {t("basket.shipping")}
                        </span>
                        <span className="text-emerald-500 font-medium">
                          {t("basket.free")}
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between text-[16px] font-bold">
                        <span className="text-foreground">
                          {t("basket.total")}
                        </span>
                        <span className="text-primary">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
                    >
                      {t("basket.checkout")}
                      <ArrowRight className="w-[18px] h-[18px]" />
                    </button>

                    <button
                      onClick={handleViewCart}
                      className="w-full py-[12px] mt-[8px] text-primary font-medium hover:bg-primary/10 rounded-[12px] transition-colors"
                    >
                      {t("basket.viewFullCart")}
                    </button>
                  </div>
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
