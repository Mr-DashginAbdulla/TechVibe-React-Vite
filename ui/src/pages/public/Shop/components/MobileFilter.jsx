import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLenisContext } from "@/context/LenisProvider";
import FilterSidebar from "./FilterSidebar";

const MobileFilter = ({
  isOpen,
  onClose,
  categories,
  brands,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const lenis = useLenisContext();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [isOpen, onClose, lenis]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-[320px] max-w-[90vw] bg-background z-50 shadow-xl border-r border-border flex flex-col"
          >
            <div
              className="flex-1 overflow-y-auto"
              style={{
                overscrollBehavior: "contain",
                scrollBehavior: "smooth",
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedFilters={{
                  categories: filters.categories,
                  brands: filters.brands,
                  minPrice: filters.minPrice,
                  maxPrice: filters.maxPrice,
                  minRating: filters.minRating,
                }}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                isMobile={true}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default MobileFilter;
