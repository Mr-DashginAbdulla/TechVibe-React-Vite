import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const swipeHandlers = {
    drag: "x",
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 1,
    onDragEnd: (e, { offset, velocity }) => {
      const swipe = Math.abs(offset.x) * velocity.x;
      if (swipe < -10000) {
        handleNext();
      } else if (swipe > 10000) {
        handlePrev();
      }
    },
  };

  return (
    <div className="relative bg-card rounded-3xl overflow-hidden border border-border">
      <div className="aspect-4/3 flex items-center justify-center p-8 relative group overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex] || "https://via.placeholder.com/500"}
            alt={productName}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            {...swipeHandlers}
            className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>

        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-foreground/80 backdrop-blur-sm text-background text-sm font-medium px-3 py-1.5 rounded-full">
          {activeIndex + 1} / {totalImages}
        </div>
      </div>

      {totalImages > 1 && (
        <div className="flex gap-2 p-4 bg-card border-t border-border">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIndex === idx
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-border"
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
