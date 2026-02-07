import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

  // RTK Query hooks for real-time sync
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
      toast.success(t("wishlist.removed"));
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
      // Check if already in cart
      const existingCartItem = cartItems.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingCartItem) {
        // Update quantity
        await updateCartItem({
          id: existingCartItem.id,
          quantity: (existingCartItem.quantity || 1) + 1,
        }).unwrap();
        toast.success(t("productDetails.cartUpdated"));
      } else {
        // Add new item
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
        <Loader2 className="w-[32px] h-[32px] text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.myWishlist")} - TechVibe</title>
      </Helmet>
      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] bg-pink-100 rounded-[12px] flex items-center justify-center">
            <Heart className="w-[24px] h-[24px] text-pink-600" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#111827]">
              {t("profile.myWishlist")}
            </h1>
            <p className="text-[15px] text-[#6B7280]">
              {wishlist.length} {t("order.items")}
            </p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[60px] text-center">
          <Heart className="w-[48px] h-[48px] text-[#9CA3AF] mx-auto mb-[16px]" />
          <p className="text-[16px] font-medium text-[#6B7280]">
            {t("wishlist.empty")}
          </p>
          <p className="text-[14px] text-[#9CA3AF] mt-[4px]">
            {t("wishlist.browseProducts")}
          </p>
          <Link
            to="/shop"
            className="inline-block mt-[16px] px-[24px] py-[12px] bg-[#3B82F6] text-white font-semibold rounded-[12px] hover:bg-[#2563EB] transition-colors"
          >
            {t("basket.startShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Remove Button (replaces heart in ProductCard) */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:bg-red-50 transition-all text-red-500"
                title={t("wishlist.removeFromList")}
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>

              {/* Image */}
              <Link
                to={`/product/${item.productId}`}
                className="relative w-full h-[220px] bg-[#F9FAFB] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                />
              </Link>

              <div className="p-[16px]">
                {/* Rating (placeholder since wishlist items may not have rating) */}
                <div className="flex items-center gap-[4px] mb-[8px]">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-[14px] h-[14px] fill-[#3B82F6] text-[#3B82F6]"
                    />
                  ))}
                </div>

                {/* Name */}
                <Link to={`/product/${item.productId}`}>
                  <h3 className="text-[15px] font-medium text-[#111827] mb-[8px] line-clamp-2 min-h-[40px] hover:text-[#3B82F6] transition-colors">
                    {item.name}
                  </h3>
                </Link>

                {/* Price and Cart Button */}
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-bold text-[#111827]">
                    ${Number(item.price || 0).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-[40px] h-[40px] bg-[#3B82F6] hover:bg-[#2563EB] rounded-[10px] flex items-center justify-center transition-colors shadow-lg shadow-blue-100"
                    title={t("product.addToCart")}
                  >
                    <ShoppingCart className="w-[18px] h-[18px] text-white" />
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
