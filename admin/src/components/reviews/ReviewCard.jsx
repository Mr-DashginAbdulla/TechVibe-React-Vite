import { useTranslation } from "react-i18next";
import { Star, Trash2, ThumbsUp } from "lucide-react";

const ReviewCard = ({ review, productName, productImage, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-[14px] sm:p-[18px]">
      <div className="flex gap-[12px]">
        <img
          src={productImage}
          alt=""
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-[10px] object-cover shrink-0 hidden xs:block"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-[10px]">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#111827]">
                {review.userName}
              </p>
              <p className="text-[12px] sm:text-[13px] text-[#6B7280] truncate">
                {productName}
              </p>
            </div>
            <div className="flex items-center gap-[6px] shrink-0">
              <div className="flex gap-px">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-[14px] h-[14px] ${s <= review.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E5E7EB]"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => onDelete(review)}
                className="p-[6px] hover:bg-red-50 rounded-[6px]"
              >
                <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
              </button>
            </div>
          </div>
          <p className="text-[13px] sm:text-[14px] text-[#374151] mt-[8px] line-clamp-2 sm:line-clamp-none">
            {review.comment}
          </p>
          <div className="flex items-center gap-[12px] mt-[8px] text-[11px] sm:text-[12px] text-[#6B7280]">
            <span>{new Date(review.date).toLocaleDateString()}</span>
            {review.helpful > 0 && (
              <div className="flex items-center gap-[3px]">
                <ThumbsUp className="w-[12px] h-[12px]" />
                {review.helpful}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
