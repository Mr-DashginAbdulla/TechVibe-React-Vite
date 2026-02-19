import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { showToast as toast } from "@/components/shared/StyledToast";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

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
          <div className="flex flex-col items-center justify-center py-[60px] px-[24px]">
            <div className="relative mb-[20px]">
              <div className="w-[80px] h-[80px] bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-[36px] h-[36px] text-primary" />
              </div>
            </div>
            <h3 className="text-[18px] font-semibold text-foreground mb-[8px]">
              {t("basket.emptyTitle")}
            </h3>
            <p className="text-[14px] text-muted-foreground text-center mb-[20px] max-w-[300px]">
              {t("basket.emptyDesc")}
            </p>
            <Link
              to="/"
              className="flex items-center gap-[8px] px-[20px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
            >
              {t("basket.startShopping")}
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-[16px] p-[20px] hover:bg-muted/50 transition-colors"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="shrink-0 w-[80px] h-[80px] bg-muted rounded-[12px] overflow-hidden"
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
                      className="text-[15px] font-semibold text-foreground hover:text-primary line-clamp-1 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[17px] font-bold text-primary mt-[4px]">
                      ${(item.price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-[16px] mt-[10px]">
                      <div className="flex items-center border border-border rounded-[8px]">
                        <button
                          onClick={() =>
                            handleQuantityChange(item, (item.quantity || 1) - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-[8px] hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-l-[8px]"
                        >
                          <Minus className="w-[14px] h-[14px] text-foreground" />
                        </button>
                        <span className="w-[40px] text-center text-[14px] font-semibold text-foreground">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item, (item.quantity || 1) + 1)
                          }
                          className="p-[8px] hover:bg-muted transition-colors rounded-r-[8px]"
                        >
                          <Plus className="w-[14px] h-[14px] text-foreground" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-[8px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[8px] transition-colors"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold text-foreground">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-[20px] bg-muted/30 border-t border-border">
              <div className="flex items-center justify-between mb-[12px]">
                <span className="text-[15px] text-muted-foreground">
                  {t("basket.subtotal")}
                </span>
                <span className="text-[15px] font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-[16px]">
                <span className="text-[15px] text-muted-foreground">
                  {t("basket.shipping")}
                </span>
                <span className="text-[15px] font-medium text-success">
                  {t("basket.free")}
                </span>
              </div>
              <div className="h-px bg-border mb-[16px]" />
              <div className="flex items-center justify-between mb-[20px]">
                <span className="text-[17px] font-bold text-foreground">
                  {t("basket.total")}
                </span>
                <span className="text-[20px] font-bold text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-[8px] w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
              >
                {t("basket.checkout")}
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileCart;
