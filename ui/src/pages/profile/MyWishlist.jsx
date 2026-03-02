import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { useAuth } from "@/context/AuthContext";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
} from "@/store/api/apiSlice";
import { Heart, Loader2 } from "lucide-react";
import WishlistItemCard from "./components/WishlistItemCard";
import EmptyWishlist from "./components/EmptyWishlist";

const MyWishlist = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const {
    data: wishlist = [],
    isLoading,
    refetch,
  } = useGetWishlistQuery(user?.id, {
    skip: !user?.id,
  });

  const { data: cartItems = [] } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id).unwrap();
      toast.info(t("wishlist.removed"));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      toast.error(t("auth.signIn"));
      return;
    }

    try {
      const existingCartItem = cartItems.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingCartItem) {
        await updateCartItem({
          id: existingCartItem.id,
          quantity: (existingCartItem.quantity || 1) + 1,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        await addToCart({
          userId: user.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          selectedOptions: {},
        }).unwrap();
        toast.success(t("productDetails.addedToCart"));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.myWishlist")} - TechVibe</title>
      </Helmet>
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] bg-destructive/10 rounded-[12px] flex items-center justify-center">
            <Heart className="w-[24px] h-[24px] text-destructive" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-foreground">
              {t("profile.myWishlist")}
            </h1>
            <p className="text-[15px] text-muted-foreground">
              {wishlist.length} {t("order.items")}
            </p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {wishlist.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
