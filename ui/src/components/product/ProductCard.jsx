import { Heart, ShoppingCart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // Link əlavə olundu

const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating = 5,
  reviewCount = 0,
  discount,
  isNew = false,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  return (
    <div className="group relative bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Etiketlər */}
      <div className="absolute top-[12px] left-[12px] z-10 flex flex-col gap-[6px]">
        {discount && (
          <span className="bg-[#3B82F6] text-white text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="bg-[#10B981] text-white text-[12px] font-semibold px-[10px] py-[4px] rounded-[6px]">
            {t("product.new")}
          </span>
        )}
      </div>

      {/* Sevimlilər Düyməsi */}
      <button
        onClick={(e) => {
          e.preventDefault(); // Link-ə keçidin qarşısını alır
          onToggleFavorite?.(id);
        }}
        className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-red-500"
      >
        <Heart
          className={`w-[18px] h-[18px] ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>

      {/* Şəkil - Link ilə əhatələndi */}
      <Link
        to={`/product/${id}`}
        className="block relative w-full h-[220px] bg-[#F9FAFB] flex items-center justify-center overflow-hidden"
      >
        <img
          src={image}
          alt={name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </Link>

      <div className="p-[16px]">
        {/* Reytinq */}
        <div className="flex items-center gap-[4px] mb-[8px]">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-[14px] h-[14px] ${
                index < Math.floor(rating)
                  ? "fill-[#3B82F6] text-[#3B82F6]"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-[12px] text-[#6B7280] ml-[4px]">
            ({reviewCount})
          </span>
        </div>

        {/* Ad - Link ilə əhatələndi */}
        <Link to={`/product/${id}`}>
          <h3 className="text-[15px] font-medium text-[#111827] mb-[8px] line-clamp-2 min-h-[40px] hover:text-[#3B82F6] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Qiymət və Səbət */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <span className="text-[18px] font-bold text-[#111827]">
              ${Number(price).toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[14px] text-[#9CA3AF] line-through">
                ${Number(originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart?.(id)}
            className="w-[40px] h-[40px] bg-[#3B82F6] hover:bg-[#2563EB] rounded-[10px] flex items-center justify-center transition-colors shadow-lg shadow-blue-100"
            title={t("product.addToCart")}
          >
            <ShoppingCart className="w-[18px] h-[18px] text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
