import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-60 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-blue-100 rounded-[10px] flex items-center justify-center">
              <ShoppingBag className="w-[20px] h-[20px] text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#111827]">
                {t("basket.title")}
              </h2>
              <p className="text-[13px] text-[#6B7280]">
                {cartItems.length} {t("basket.items")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
          >
            <X className="w-[22px] h-[22px] text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {!user ? (
            // Not logged in
            <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
              <div className="w-[80px] h-[80px] bg-blue-50 rounded-full flex items-center justify-center mb-[16px]">
                <ShoppingBag className="w-[36px] h-[36px] text-[#3B82F6]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#111827] mb-[8px]">
                {t("basket.loginRequired")}
              </h3>
              <p className="text-[14px] text-[#6B7280] text-center mb-[20px]">
                {t("basket.loginRequiredDesc")}
              </p>
              <Link
                to="/auth/login"
                onClick={onClose}
                className="px-[24px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors"
              >
                {t("auth.signIn")}
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            // Empty cart
            <div className="flex-1 flex flex-col items-center justify-center p-[24px]">
              <div className="relative mb-[20px]">
                <div className="w-[100px] h-[100px] bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-[44px] h-[44px] text-[#3B82F6]" />
                </div>
                <div className="absolute -bottom-[4px] -right-[4px] w-[36px] h-[36px] bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[18px]">😢</span>
                </div>
              </div>
              <h3 className="text-[18px] font-semibold text-[#111827] mb-[8px]">
                {t("basket.emptyTitle")}
              </h3>
              <p className="text-[14px] text-[#6B7280] text-center mb-[20px]">
                {t("basket.emptyDesc")}
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                className="flex items-center gap-[8px] px-[24px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors"
              >
                {t("basket.startShopping")}
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>
            </div>
          ) : (
            // Cart items
            <>
              <div className="flex-1 overflow-y-auto p-[16px] space-y-[12px]">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-[12px] p-[12px] bg-[#F9FAFB] rounded-[14px] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={onClose}
                      className="shrink-0 w-[72px] h-[72px] bg-white rounded-[10px] overflow-hidden border border-[#E5E7EB]"
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
                        className="text-[14px] font-semibold text-[#111827] hover:text-[#3B82F6] line-clamp-2 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[15px] font-bold text-[#3B82F6] mt-[4px]">
                        ${(item.price || 0).toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-[8px]">
                        <div className="flex items-center border border-[#E5E7EB] rounded-[8px] bg-white">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                (item.quantity || 1) - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-[6px] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-[8px]"
                          >
                            <Minus className="w-[14px] h-[14px]" />
                          </button>
                          <span className="w-[32px] text-center text-[13px] font-semibold text-[#111827]">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                (item.quantity || 1) + 1,
                              )
                            }
                            className="p-[6px] hover:bg-[#F3F4F6] transition-colors rounded-r-[8px]"
                          >
                            <Plus className="w-[14px] h-[14px]" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-[6px] text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-[6px] transition-colors"
                        >
                          <Trash2 className="w-[16px] h-[16px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-[16px] border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="space-y-[8px] mb-[16px]">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B7280]">
                      {t("basket.subtotal")}
                    </span>
                    <span className="text-[#111827] font-medium">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B7280]">
                      {t("basket.shipping")}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {t("basket.free")}
                    </span>
                  </div>
                  <div className="h-px bg-[#E5E7EB]" />
                  <div className="flex justify-between text-[16px] font-bold">
                    <span className="text-[#111827]">{t("basket.total")}</span>
                    <span className="text-[#3B82F6]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-[14px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
                >
                  {t("basket.checkout")}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </button>

                <button
                  onClick={handleViewCart}
                  className="w-full py-[12px] mt-[8px] text-[#3B82F6] font-medium hover:bg-[#EFF6FF] rounded-[12px] transition-colors"
                >
                  {t("basket.viewFullCart")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
