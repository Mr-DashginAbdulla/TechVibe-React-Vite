import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenisContext } from "@/context/LenisProvider";

/**
 * Scrolls to top of page on every route change
 * Uses Lenis scrollTo for smooth scroll compatibility
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenisContext();

  // useLayoutEffect runs before paint, ensuring scroll reset before render
  useLayoutEffect(() => {
    // Reset scroll position immediately
    if (lenis) {
      // Use Lenis scrollTo for smooth scroll compatibility
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback for cases where Lenis isn't ready
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
