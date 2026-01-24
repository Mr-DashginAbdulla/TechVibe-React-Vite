import HeroSection from "./HeroSection";
import NewArrivals from "./components/NewArrivals";
import ShopByCategory from "./components/ShopByCategory";
import FeaturedProducts from "./components/FeaturedProducts";
import Newsletter from "./components/Newsletter";

function Home() {
  // These handlers will be implemented by you
  // They receive product id as parameter
  const handleAddToCart = (productId) => {
    console.log("Add to cart:", productId);
    // Your implementation here
  };

  const handleToggleFavorite = (productId) => {
    console.log("Toggle favorite:", productId);
    // Your implementation here
  };

  return (
    <>
      <HeroSection />

      <NewArrivals
        // products={[]} // Pass products from store/backend here
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      <ShopByCategory />

      <FeaturedProducts
        // products={[]} // Pass products from store/backend here
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      <Newsletter />
    </>
  );
}

export default Home;
