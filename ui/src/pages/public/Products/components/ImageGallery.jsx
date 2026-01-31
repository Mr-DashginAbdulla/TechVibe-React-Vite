import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images = [], productName, isNew = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = images.length || 1;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-gray-50 rounded-3xl overflow-hidden">
      {/* Main Image */}
      <div className="aspect-4/3 flex items-center justify-center p-8 relative group">
        <img
          src={images[activeIndex] || "https://via.placeholder.com/500"}
          alt={productName}
          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />

        {/* Navigation Arrows */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
          {activeIndex + 1} / {totalImages}
        </div>
      </div>

      {/* Thumbnail Strip - Only show if more than 1 image */}
      {totalImages > 1 && (
        <div className="flex gap-2 p-4 bg-white border-t border-gray-100">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIndex === idx
                  ? "border-blue-500 shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
