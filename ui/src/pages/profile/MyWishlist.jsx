import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { wishlistService } from "@/services/wishlistService";
import { Heart, ShoppingCart, Eye, Trash2, Loader2, Star } from "lucide-react";

const MyWishlist = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [user?.id]);

  const fetchWishlist = async () => {
    if (!user?.id) return;
    try {
      const data = await wishlistService.getByUserId(user.id);
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await wishlistService.remove(id);
      setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = (item) => {
    console.log("Add to cart:", item);
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] overflow-hidden group"
            >
              <div className="relative h-[200px] bg-[#F9FAFB]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.discount && (
                  <span className="absolute top-[12px] left-[12px] px-[10px] py-[4px] bg-red-500 text-white text-[12px] font-medium rounded-full">
                    -{item.discount}%
                  </span>
                )}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-[16px] py-[8px] bg-white text-[14px] font-medium rounded-full">
                      {t("product.outOfStock")}
                    </span>
                  </div>
                )}
                <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-[36px] h-[36px] bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#F3F4F6]">
                    <Eye className="w-[18px] h-[18px] text-[#374151]" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-[36px] h-[36px] bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50"
                  >
                    <Trash2 className="w-[18px] h-[18px] text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-[16px]">
                <p className="text-[12px] text-[#6B7280] mb-[4px]">
                  {item.brand}
                </p>
                <h3 className="text-[15px] font-semibold text-[#111827] mb-[8px] line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-[4px] mb-[12px]">
                  <Star className="w-[14px] h-[14px] text-yellow-400 fill-yellow-400" />
                  <span className="text-[13px] font-medium text-[#374151]">
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center gap-[8px] mb-[16px]">
                  <span className="text-[18px] font-bold text-[#111827]">
                    ${(item.price || 0).toFixed(2)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-[14px] text-[#9CA3AF] line-through">
                      ${(item.originalPrice || 0).toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                  className="flex items-center justify-center gap-[8px] w-full py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#9CA3AF] text-white font-semibold rounded-[12px] transition-colors"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  {t("product.addToCart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
