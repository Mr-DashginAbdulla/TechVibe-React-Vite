import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { reviewService, productService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import ReviewCard from "@/components/reviews/ReviewCard";

const ITEMS_PER_PAGE = 10;

const Reviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, productsData] = await Promise.all([
          reviewService.getAll(),
          productService.getAll(),
        ]);
        setReviews(reviewsData);
        setProducts(productsData);
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter]);

  const handleDelete = async () => {
    try {
      await reviewService.delete(reviewToDelete.id);
      setReviews(reviews.filter((r) => r.id !== reviewToDelete.id));
      toast.success(t("reviews.deleteSuccess"));
      setReviewToDelete(null);
    } catch {
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[20px]">
      <div>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground">
          {t("reviews.title")}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-muted-foreground mt-[2px]">
          {filteredReviews.length} {t("reviews.totalReviews")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder={t("reviews.searchReviews")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
        >
          <option value="">{t("reviews.allRatings")}</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-[12px]">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              productName={getProductName(review.productId)}
              productImage={getProductImage(review.productId)}
              onDelete={setReviewToDelete}
            />
          ))
        ) : (
          <div className="bg-card rounded-[14px] border border-border p-[50px] text-center">
            <MessageSquare className="w-[40px] h-[40px] text-muted-foreground mx-auto mb-[10px]" />
            <p className="text-[14px] text-muted-foreground">
              {t("reviews.noReviews")}
            </p>
          </div>
        )}
      </div>

      <div className="bg-card rounded-[14px] border border-border overflow-hidden">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredReviews.length}
        />
      </div>

      {reviewToDelete && (
        <DeleteConfirmModal
          title={t("reviews.deleteReview")}
          message={t("reviews.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setReviewToDelete(null)}
        />
      )}
    </div>
  );
};

export default Reviews;
