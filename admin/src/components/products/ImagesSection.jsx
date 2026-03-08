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
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <h2 className="text-[16px] font-semibold text-foreground mb-[16px]">
        {t("products.productImages")}
      </h2>
      <div className="space-y-[14px]">
        <div className="flex gap-[8px]">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={t("productForm.enterImageUrl")}
            className="flex-1 px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="px-[14px] py-[10px] bg-primary text-primary-foreground rounded-[10px] text-[14px] font-medium hover:bg-primary/90"
          >
            <Plus className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[12px] text-muted-foreground">
            {t("products.upload")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-[20px] border-2 border-dashed border-border rounded-[10px] text-center hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-[24px] h-[24px] text-muted-foreground mx-auto mb-[4px]" />
          <p className="text-[13px] text-muted-foreground">
            {t("products.clickToUpload")}{" "}
            <span className="text-primary font-medium">
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
                    index === 0 ? "border-primary" : "border-transparent"
                  }`}
                />
                {index === 0 && (
                  <div className="absolute top-[4px] left-[4px]">
                    <Star className="w-[16px] h-[16px] text-primary fill-primary" />
                  </div>
                )}
                <div className="absolute top-[4px] right-[4px] opacity-0 group-hover:opacity-100 flex gap-[4px]">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className="p-[4px] bg-card rounded-full shadow-sm"
                      title={t("products.setMainImage")}
                    >
                      <Star className="w-[12px] h-[12px] text-muted-foreground" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-[4px] bg-card rounded-full shadow-sm"
                  >
                    <X className="w-[12px] h-[12px] text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground text-center py-[10px]">
            {t("products.noImages")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
