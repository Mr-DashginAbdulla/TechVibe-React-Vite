import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { showToast as toast } from "@/components/shared/StyledToast";
import { ShoppingCart } from "lucide-react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/store/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import CartItemCard from "./components/CartItemCard";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";

const ProfileCart = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: cartItems = [], isLoading } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

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

  if (isLoading) {
    return (
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[32px]">
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-[40px] h-[40px] border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("nav.cart")} - TechVibe</title>
      </Helmet>

      <div className="bg-card rounded-[20px] shadow-sm border border-border">
        <div className="flex items-center gap-[16px] p-[24px] border-b border-border">
          <div className="w-[48px] h-[48px] bg-primary/10 rounded-[12px] flex items-center justify-center">
            <ShoppingCart className="w-[24px] h-[24px] text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-foreground">
              {t("nav.cart")}
            </h1>
            <p className="text-[14px] text-muted-foreground">
              {cartItems.length} {t("basket.items")}
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="divide-y divide-border">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            <CartSummary subtotal={subtotal} />
          </>
        )}
      </div>
    </>
  );
};

export default ProfileCart;
