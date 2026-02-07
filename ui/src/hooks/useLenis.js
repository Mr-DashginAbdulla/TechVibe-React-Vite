import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * useLenis - Custom hook for smooth scrolling with Lenis
 * Provides butter-smooth, high FPS scrolling experience
 *
 * @param {Object} options - Lenis configuration options
 * @returns {Lenis|null} - Lenis instance
 */
const useLenis = (options = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with optimal settings
    const lenis = new Lenis({
      duration: 1.2, // Scroll animation duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for smooth feel
      orientation: "vertical", // Scroll orientation
      gestureOrientation: "vertical", // Gesture orientation
      smoothWheel: true, // Enable smooth wheel scrolling
      wheelMultiplier: 1, // Wheel scroll speed multiplier
      touchMultiplier: 2, // Touch scroll speed multiplier
      infinite: false, // Infinite scrolling
      ...options,
    });

    lenisRef.current = lenis;

    // Animation frame loop for smooth updates
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
};

export default useLenis;
