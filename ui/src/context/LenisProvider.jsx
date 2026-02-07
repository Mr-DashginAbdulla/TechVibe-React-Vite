import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";

// Create context for Lenis instance
const LenisContext = createContext(null);

/**
 * LenisProvider - Wraps app with smooth scroll functionality
 * Provides Lenis instance via context for child components
 */
export const LenisProvider = ({ children, options = {} }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with premium settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links for smooth scroll to sections
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute("href").slice(1);
        const element = document.getElementById(id);
        if (element) {
          lenis.scrollTo(element, { offset: -100 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
};

/**
 * useLenisContext - Hook to access Lenis instance from context
 */
export const useLenisContext = () => {
  const lenisRef = useContext(LenisContext);
  return lenisRef?.current;
};

export default LenisProvider;
