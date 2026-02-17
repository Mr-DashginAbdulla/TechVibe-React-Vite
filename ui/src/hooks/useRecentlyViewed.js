import { useEffect } from "react";

export const useRecentlyViewed = (product) => {
  useEffect(() => {
    if (product) {
      const viewedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
      };

      const saved = localStorage.getItem("recentlyViewed");
      let recentlyViewed = saved ? JSON.parse(saved) : [];

      recentlyViewed = recentlyViewed.filter((p) => p.id !== product.id);
      recentlyViewed.unshift(viewedProduct);

      if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
      }

      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
  }, [product]);
};
