import { useRef } from "react";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ImageUploader = ({
  images,
  maxImages,
  isUploading,
  onUpload,
  onRemove,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    onUpload(e);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-border"
            >
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-destructive hover:bg-destructive/90 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
            id="review-images"
          />
          <label
            htmlFor="review-images"
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              <>
                <ImagePlus size={20} />
                {t("productDetails.addPhotos")}
              </>
            )}
          </label>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        {t("productDetails.maxPhotosHint", { max: maxImages })}
      </p>
    </div>
  );
};

export default ImageUploader;
