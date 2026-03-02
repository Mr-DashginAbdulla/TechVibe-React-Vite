import { useState } from "react";
import { showToast as toast } from "@/components/shared/StyledToast";
import { useAuthModal } from "@/context/AuthModalContext";
import {
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/store/api/apiSlice";

export const useProductReviews = (productId, user) => {
  const { openAuthModal } = useAuthModal();
  const { data: reviews = [] } = useGetProductReviewsQuery(productId);

  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation(); // Removed unused variable `result`

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null);

  const handleSubmitReview = async (
    { rating, comment, images = [], id: reviewId },
    t,
  ) => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      if (reviewId) {
        await updateReview({
          id: reviewId,
          rating,
          comment,
          images,
        }).unwrap();
        toast.success(t("productDetails.reviewUpdated"));
        setEditReviewData(null);
      } else {
        await addReview({
          productId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName?.charAt(0) || ""}.`,
          rating,
          comment,
          images,
          date: new Date().toISOString().split("T")[0],
          helpfulCount: 0,
          helpfulBy: [],
          unhelpfulCount: 0,
          unhelpfulBy: [],
        }).unwrap();
        toast.success(t("productDetails.reviewSubmitted"));
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleEditReview = (review) => {
    setEditReviewData(review);
    setReviewModalOpen(true);
  };

  const handleHelpful = async (review, t) => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (review.userId === user.id) {
      toast.info(t("productDetails.cannotVoteOwnReview"));
      return;
    }

    const hasVotedHelpful = review.helpfulBy?.includes(user.id);
    const hasVotedUnhelpful = review.unhelpfulBy?.includes(user.id);

    try {
      if (hasVotedHelpful) {
        await updateReview({
          id: review.id,
          helpfulCount: Math.max((review.helpfulCount || 0) - 1, 0),
          helpfulBy: (review.helpfulBy || []).filter((id) => id !== user.id),
        }).unwrap();
      } else {
        const updates = {
          id: review.id,
          helpfulCount: (review.helpfulCount || 0) + 1,
          helpfulBy: [...(review.helpfulBy || []), user.id],
        };
        if (hasVotedUnhelpful) {
          updates.unhelpfulCount = Math.max(
            (review.unhelpfulCount || 0) - 1,
            0,
          );
          updates.unhelpfulBy = (review.unhelpfulBy || []).filter(
            (id) => id !== user.id,
          );
        }
        await updateReview(updates).unwrap();
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleUnhelpful = async (review, t) => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (review.userId === user.id) {
      toast.info(t("productDetails.cannotVoteOwnReview"));
      return;
    }

    const hasVotedHelpful = review.helpfulBy?.includes(user.id);
    const hasVotedUnhelpful = review.unhelpfulBy?.includes(user.id);

    try {
      if (hasVotedUnhelpful) {
        await updateReview({
          id: review.id,
          unhelpfulCount: Math.max((review.unhelpfulCount || 0) - 1, 0),
          unhelpfulBy: (review.unhelpfulBy || []).filter(
            (id) => id !== user.id,
          ),
        }).unwrap();
      } else {
        const updates = {
          id: review.id,
          unhelpfulCount: (review.unhelpfulCount || 0) + 1,
          unhelpfulBy: [...(review.unhelpfulBy || []), user.id],
        };
        if (hasVotedHelpful) {
          updates.helpfulCount = Math.max((review.helpfulCount || 0) - 1, 0);
          updates.helpfulBy = (review.helpfulBy || []).filter(
            (id) => id !== user.id,
          );
        }
        await updateReview(updates).unwrap();
      }
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  const handleDeleteReview = async (reviewId, t) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const review = reviews.find((r) => r.id === reviewId);
    if (!review || review.userId !== user.id) {
      toast.error(t("messages.notAuthorized"));
      return;
    }

    try {
      await deleteReview(reviewId).unwrap();
      toast.success(t("productDetails.reviewDeleted"));
    } catch (error) {
      toast.error(t("messages.somethingWentWrong"));
    }
  };

  return {
    reviews,
    reviewModalOpen,
    setReviewModalOpen,
    editReviewData,
    setEditReviewData,
    handleSubmitReview,
    handleEditReview,
    handleHelpful,
    handleUnhelpful,
    handleDeleteReview,
  };
};
