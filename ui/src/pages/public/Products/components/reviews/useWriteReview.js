import { useState, useEffect } from "react";

const useWriteReview = (editData, isOpen, onSubmit, onClose) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_IMAGES = 3;
  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setRating(editData.rating || 0);
      setComment(editData.comment || "");
      setImages(editData.images || []);
    } else {
      setRating(0);
      setComment("");
      setImages([]);
    }
  }, [editData, isOpen]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);
    if (filesToProcess.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = await Promise.all(
        filesToProcess.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
        ),
      );
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setImages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    onSubmit({
      rating,
      comment,
      images,
      ...(isEditMode && { id: editData.id }),
    });
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    images,
    isUploading,
    isEditMode,
    MAX_IMAGES,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleClose,
  };
};

export default useWriteReview;
