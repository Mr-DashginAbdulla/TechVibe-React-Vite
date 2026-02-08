import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenisContext } from "@/context/LenisProvider";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenisContext();

  useLayoutEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
