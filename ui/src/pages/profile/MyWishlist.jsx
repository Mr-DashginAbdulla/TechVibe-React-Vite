import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { showToast as toast } from "@/components/shared/StyledToast";
import { useAuth } from "@/context/AuthContext";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
} from "@/store/api/productsApi";
import { Heart, ShoppingCart, Eye, Trash2, Loader2, Star } from "lucide-react";

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
        <div className="bg-card rounded-[20px] shadow-sm border border-border p-[60px] text-center">
          <Heart className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[16px]" />
          <p className="text-[16px] font-medium text-muted-foreground">
            {t("wishlist.empty")}
          </p>
          <p className="text-[14px] text-muted-foreground mt-[4px]">
            {t("wishlist.browseProducts")}
          </p>
          <Link
            to="/shop"
            className="inline-block mt-[16px] px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
          >
            {t("basket.startShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-card rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-border transition-all duration-300 hover:-translate-y-1"
            >
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:bg-destructive/10 transition-all text-destructive"
                title={t("wishlist.removeFromList")}
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>

              <Link
                to={`/product/${item.productId}`}
                className="relative w-full h-[220px] bg-muted/50 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
                />
              </Link>

              <div className="p-[16px]">
                <div className="flex items-center gap-[4px] mb-[8px]">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-[14px] h-[14px] fill-primary text-primary"
                    />
                  ))}
                </div>

                <Link to={`/product/${item.productId}`}>
                  <h3 className="text-[15px] font-medium text-foreground mb-[8px] line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-bold text-foreground">
                    ${Number(item.price || 0).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-[40px] h-[40px] bg-primary hover:bg-primary/90 rounded-[10px] flex items-center justify-center transition-colors shadow-lg shadow-blue-100 dark:shadow-none"
                    title={t("product.addToCart")}
                  >
                    <ShoppingCart className="w-[18px] h-[18px] text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
