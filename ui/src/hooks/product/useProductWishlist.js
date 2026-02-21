import { showToast as toast } from "@/components/shared/StyledToast";
import { useAuthModal } from "@/context/AuthModalContext";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistItemQuery,
  useGetWishlistQuery,
} from "@/store/api/productsApi";

export const useProductWishlist = (productId, user) => {
  const { openAuthModal } = useAuthModal();
  const { data: wishlistItems = [] } = useCheckWishlistItemQuery(
    { userId: user?.id, productId },
    { skip: !user?.id },
  );

  const { data: allWishlistItems = [] } = useGetWishlistQuery(user?.id, {
    skip: !user?.id,
  });

  const isInWishlist = wishlistItems.length > 0;

  const isProductInWishlist = (pid) =>
    allWishlistItems.some((item) => item.productId === pid);

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleToggleWishlist = async (product, t) => {
    if (!user) {
      openAuthModal();
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

  const handleRelatedToggleFavorite = async (pid, t) => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const existing = allWishlistItems.find((item) => item.productId === pid);
      if (existing) {
        await removeFromWishlist(existing.id).unwrap();
        toast.info(t("productDetails.removedFromWishlist"));
      } else {
        await addToWishlist({
          userId: user.id,
          productId: pid,
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
    isProductInWishlist,
    handleToggleWishlist,
    handleRelatedToggleFavorite,
  };
};
