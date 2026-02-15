import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, Star, Upload } from "lucide-react";

const ImagesSection = ({ images, setImages }) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  const addImageUrl = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setMainImage = (index) => {
    const updated = [...images];
    const [main] = updated.splice(index, 1);
    updated.unshift(main);
    setImages(updated);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
      <h2 className="text-[16px] font-semibold text-[#111827] mb-[16px]">
        {t("products.productImages")}
      </h2>
      <div className="space-y-[14px]">
        <div className="flex gap-[8px]">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={t("productForm.enterImageUrl")}
            className="flex-1 px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="px-[14px] py-[10px] bg-[#3B82F6] text-white rounded-[10px] text-[14px] font-medium hover:bg-[#2563EB]"
          >
            <Plus className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
          <span className="text-[12px] text-[#6B7280]">
            {t("products.upload")}
          </span>
          <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-[20px] border-2 border-dashed border-[#E5E7EB] rounded-[10px] text-center hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-colors"
        >
          <Upload className="w-[24px] h-[24px] text-[#9CA3AF] mx-auto mb-[4px]" />
          <p className="text-[13px] text-[#6B7280]">
            {t("products.clickToUpload")}{" "}
            <span className="text-[#3B82F6] font-medium">
              {t("products.click")}
            </span>
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        {images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-[10px]">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt=""
                  className={`w-full aspect-square object-cover rounded-[10px] border-2 ${
                    index === 0 ? "border-[#3B82F6]" : "border-transparent"
                  }`}
                />
                {index === 0 && (
                  <div className="absolute top-[4px] left-[4px]">
                    <Star className="w-[16px] h-[16px] text-[#3B82F6] fill-[#3B82F6]" />
                  </div>
                )}
                <div className="absolute top-[4px] right-[4px] opacity-0 group-hover:opacity-100 flex gap-[4px]">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className="p-[4px] bg-white rounded-full shadow-sm"
                      title={t("products.setMainImage")}
                    >
                      <Star className="w-[12px] h-[12px] text-[#6B7280]" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-[4px] bg-white rounded-full shadow-sm"
                  >
                    <X className="w-[12px] h-[12px] text-[#EF4444]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#9CA3AF] text-center py-[10px]">
            {t("products.noImages")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
