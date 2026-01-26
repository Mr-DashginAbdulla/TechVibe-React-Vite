import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import NewArrivals from "./components/NewArrivals";
import ShopByCategory from "./components/ShopByCategory";
import FeaturedProducts from "./components/FeaturedProducts";
import Newsletter from "./components/Newsletter";
import { toast } from "react-toastify";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/products"),
          fetch("http://localhost:3000/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error("Server xətası");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        // MAPPING: Backend adlarını Frontend-ə dəqiq uyğunlaşdırırıq
        const formattedProducts = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          // Ən vacib hissə: 'image' sahəsini dəqiq götürürük
          image: product.image,
          rating: product.rating,
          // ReviewsCount və OldPrice uyğunsuzluğunu həll edirik
          reviewCount: product.reviewsCount || 0,
          originalPrice: product.oldPrice,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        }));

        setProducts(formattedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Məlumatlar yüklənərkən xəta baş verdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrləmə
  const newArrivals = products.filter((p) => p.isNew);
  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleAddToCart = (productId) => toast.success("Səbətə atıldı!");
  const handleToggleFavorite = (productId) =>
    toast.info("Sevimlilər siyahısı yeniləndi!");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />

      {/* Məlumatları ötürürük */}
      <NewArrivals
        products={newArrivals}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      <ShopByCategory categories={categories} />

      <FeaturedProducts
        products={featuredProducts}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      <Newsletter />
    </>
  );
}

export default Home;
