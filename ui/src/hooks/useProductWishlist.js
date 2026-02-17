import { toast } from "react-toastify";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistItemQuery,
} from "@/store/api/productsApi";

export const useProductWishlist = (productId, user) => {
  const { data: wishlistItems = [] } = useCheckWishlistItemQuery(
    { userId: user?.id, productId },
    { skip: !user?.id },
  );

  const isInWishlist = wishlistItems.length > 0;

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleToggleWishlist = async (product, t) => {
    if (!user) {
      toast.error(t("messages.loginToUseWishlist"));
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(wishlistItems[0].id).unwrap();
        toast.info(t("productDetails.removedFromWishlist"));
      } else {
        await addToWishlist({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString(),
        }).unwrap();
        toast.success(t("productDetails.addedToWishlist"));
      }
    } catch (error) {
      console.error("wishlist error", error);
      toast.error(t("messages.failedToUpdateWishlist"));
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    handleToggleWishlist,
  };
};
