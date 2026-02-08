import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Star,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { reviewService, productService } from "@/services/api";

const ITEMS_PER_PAGE = 10;

const Reviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter]);

  const fetchData = async () => {
    try {
      const [reviewsData, productsData] = await Promise.all([
        reviewService.getAll(),
        productService.getAll(),
      ]);
      setReviews(reviewsData);
      setProducts(productsData);
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await reviewService.delete(reviewToDelete.id);
      setReviews(reviews.filter((r) => r.id !== reviewToDelete.id));
      toast.success(t("reviews.deleteSuccess"));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(t("messages.error"));
    }
  };

  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || t("common.unknown");
  const getProductImage = (id) => products.find((p) => p.id === id)?.image;

  const filteredReviews = reviews.filter((r) => {
    const search =
      r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getProductName(r.productId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return search && (!ratingFilter || r.rating === parseInt(ratingFilter));
  });

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };
  const getPageNumbers = () => {
    const pages = [],
      max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
          {t("reviews.title")}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-[2px]">
          {filteredReviews.length} {t("reviews.totalReviews")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder={t("reviews.searchReviews")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
        >
          <option value="">{t("reviews.allRatings")}</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-[12px]">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-[14px] border border-[#E5E7EB] p-[14px] sm:p-[18px]"
            >
              <div className="flex gap-[12px]">
                <img
                  src={getProductImage(review.productId)}
                  alt=""
                  className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-[10px] object-cover flex-shrink-0 hidden xs:block"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-[10px]">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#111827]">
                        {review.userName}
                      </p>
                      <p className="text-[12px] sm:text-[13px] text-[#6B7280] truncate">
                        {getProductName(review.productId)}
                      </p>
                    </div>
                    <div className="flex items-center gap-[6px] flex-shrink-0">
                      <div className="flex gap-[1px]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-[14px] h-[14px] ${s <= review.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#E5E7EB]"}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setReviewToDelete(review);
                          setShowDeleteModal(true);
                        }}
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
          ))
        ) : (
          <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-[50px] text-center">
            <MessageSquare className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
            <p className="text-[14px] text-[#6B7280]">
              {t("reviews.noReviews")}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[12px] bg-white rounded-[14px] border border-[#E5E7EB] px-[14px] py-[12px]">
          <p className="text-[12px] text-[#6B7280]">
            {startIndex + 1}-{Math.min(endIndex, filteredReviews.length)} /{" "}
            {filteredReviews.length}
          </p>
          <div className="flex items-center gap-[3px]">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
            >
              <ChevronsLeft className="w-[16px] h-[16px] text-[#374151]" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
            >
              <ChevronLeft className="w-[16px] h-[16px] text-[#374151]" />
            </button>
            <div className="flex gap-[3px] mx-[6px]">
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-[32px] h-[32px] rounded-[6px] text-[13px] font-medium ${currentPage === p ? "bg-[#3B82F6] text-white" : "text-[#374151] hover:bg-[#E5E7EB]"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
            >
              <ChevronRight className="w-[16px] h-[16px] text-[#374151]" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
            >
              <ChevronsRight className="w-[16px] h-[16px] text-[#374151]" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[360px]">
            <h3 className="text-[17px] font-bold text-[#111827] mb-[10px]">
              {t("reviews.deleteReview")}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-[20px]">
              {t("reviews.deleteConfirm")}
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-[14px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px]"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-[14px] py-[10px] bg-[#EF4444] text-white font-medium rounded-[10px]"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
