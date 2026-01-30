import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ArrowRight,
  CheckCircle,
  Truck,
  ShieldCheck,
  Share2,
  Zap,
  RotateCcw,
  Lock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import ProductCard from "@/components/product/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Product
        const productRes = await fetch(`http://localhost:3000/products/${id}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData = await productRes.json();

        // 2. Fetch Reviews
        const reviewsRes = await fetch(
          `http://localhost:3000/reviews?productId=${id}`,
        );
        const reviewsData = await reviewsRes.json();

        // 3. Fetch Related Products
        const relatedRes = await fetch(
          `http://localhost:3000/products?category=${productData.category}&id_ne=${id}&_limit=4`,
        );
        const relatedData = await relatedRes.json();

        // Process Data
        const formattedProduct = {
          ...productData,
          image: productData.image || "https://via.placeholder.com/500",
          images:
            productData.images && productData.images.length > 0
              ? productData.images
              : [productData.image],
          options: productData.options || [],
          specs: productData.specs || {
            Processor: "Apple M2 Chip",
            Memory: "8GB Unified Memory",
            Storage: "256GB SSD",
            Display: "13.6-inch Liquid Retina",
          }, // Default specs if missing
        };

        setProduct(formattedProduct);
        setReviews(reviewsData);
        setRelatedProducts(relatedData);

        // Initialize States
        setActiveImage(formattedProduct.images[0]);
        setCalculatedPrice(formattedProduct.price);

        // Set default options
        const defaults = {};
        if (formattedProduct.options) {
          formattedProduct.options.forEach((opt) => {
            if (opt.values && opt.values.length > 0) {
              defaults[opt.id] = opt.values[0];
            }
          });
        }
        setSelectedOptions(defaults);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // Recalculate Price when options change
  useEffect(() => {
    if (!product) return;
    let basePrice = product.price;
    let modifiers = 0;

    Object.values(selectedOptions).forEach((optVal) => {
      if (optVal && optVal.priceModifier) {
        modifiers += optVal.priceModifier;
      }
    });

    setCalculatedPrice(basePrice + modifiers);
  }, [selectedOptions, product]);

  const handleOptionSelect = (optionId, valueObj) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueObj,
    }));
  };

  const handleAddToCart = () => {
    // Construct cart item with selected options
    const cartItem = {
      id: product.id,
      name: product.name,
      price: calculatedPrice,
      image: activeImage,
      quantity: quantity,
      selectedOptions: selectedOptions,
    };
    console.log("Adding to cart:", cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center text-xl font-medium text-gray-500">
        Product not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <div className="container mx-auto px-4 pt-6 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            to="/products"
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-20">
          {/* LEFT: IMAGE GALLERY (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center relative border border-gray-100 group">
              {product.isNew && (
                <span className="absolute top-6 left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                  New Arrival
                </span>
              )}

              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl bg-gray-50 border-2 overflow-hidden transition-all duration-200 ${
                    activeImage === img
                      ? "border-blue-600 shadow-md ring-2 ring-blue-100"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-2 mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Headers */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-transform uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 ">
                    <CheckCircle size={14} className="fill-emerald-100" /> In
                    Stock
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-500">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-blue-600">
                  {reviews.length} reviews
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  ${calculatedPrice.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through font-medium mb-1.5">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                  <Zap size={14} fill="currentColor" />
                  Save ${(product.oldPrice - calculatedPrice).toFixed(2)} (
                  {Math.round((1 - calculatedPrice / product.oldPrice) * 100)}%
                  off)
                </p>
              )}
            </div>

            {/* Dynamic Options */}
            <div className="space-y-6 mb-8 flex-grow">
              {product.options.map((option) => (
                <div key={option.id}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-900">
                      {option.title}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {selectedOptions[option.id]?.label}
                    </span>
                  </div>

                  {option.type === "color" && (
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((val) => (
                        <button
                          key={val.label}
                          onClick={() => handleOptionSelect(option.id, val)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            selectedOptions[option.id]?.label === val.label
                              ? "border-blue-600 ring-2 ring-blue-100 scale-110"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          title={val.label}
                        >
                          <span
                            className="w-8 h-8 rounded-full shadow-inner"
                            style={{ backgroundColor: val.value }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {option.type === "select" && (
                    <div className="grid grid-cols-2 gap-3">
                      {option.values.map((val) => (
                        <button
                          key={val.label}
                          onClick={() => handleOptionSelect(option.id, val)}
                          className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                            selectedOptions[option.id]?.label === val.label
                              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <span className="block text-sm font-bold text-gray-900">
                            {val.label}
                          </span>
                          {val.tag && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1 block">
                              {val.tag}
                            </span>
                          )}
                          {val.priceModifier > 0 && (
                            <span className="absolute top-3 right-3 text-xs font-semibold text-blue-600">
                              +${val.priceModifier}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Quantity */}
              <div>
                <span className="block text-sm font-bold text-gray-900 mb-3">
                  Quantity
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white main-shadow">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 hover:text-blue-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-3 hover:text-blue-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {product.stock < 10 && (
                    <span className="text-sm font-medium text-amber-600">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="flex-none p-4 rounded-xl border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <Heart size={24} fill={false ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Lock size={18} />
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-bold text-gray-900">
                    Secure Payment
                  </span>
                  SSL Encryption
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Truck size={18} />
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-bold text-gray-900">
                    Fast Delivery
                  </span>
                  2-3 Business Days
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <RotateCcw size={18} />
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-bold text-gray-900">
                    Free Returns
                  </span>
                  Within 30 Days
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-xs text-gray-600">
                  <span className="block font-bold text-gray-900">
                    Warranty
                  </span>
                  1 Year Included
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS & SPECS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Description
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="leading-relaxed">{product.description}</p>
              <p>
                Experience the perfect blend of performance and style. Designed
                for professionals and creatives alike, this product delivers
                exceptional reliability and cutting-edge features that set it
                apart from the competition.
              </p>
            </div>
            {/* Specs Table */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Technical Specifications
              </h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-3 p-4 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-semibold text-gray-900">{key}</span>
                      <span className="col-span-2 text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h3>
              <div className="text-center mb-8">
                <span className="text-5xl font-black text-gray-900 block mb-2">
                  {product.rating}
                </span>
                <div className="flex justify-center text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  Based on {reviews.length} reviews
                </span>
              </div>

              <button className="w-full bg-white border border-gray-300 hover:border-gray-900 text-gray-900 font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md">
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* INDIVIDUAL REVIEWS LIST */}
        <div className="mb-24 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Latest Comments ({reviews.length})
          </h2>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700">
                        {review.user ? review.user.charAt(0) : "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {review.user}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              You Might Also Like
            </h2>
            <Link
              to="/products"
              className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                {...prod}
                onAddToCart={() => toast.success("Added to cart")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
