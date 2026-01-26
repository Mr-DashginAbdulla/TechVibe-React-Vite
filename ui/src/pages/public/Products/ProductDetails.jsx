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
} from "lucide-react";
import { toast } from "react-toastify";
import ProductCard from "@/components/product/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState("512GB"); // Demo seçim

  // Mock Storage Options (Dizayn üçün)
  const storageOptions = [
    { label: "512GB", price: 0, tag: "Included" },
    { label: "1TB", price: 200, tag: "+$200.00" },
    { label: "2TB", price: 400, tag: "+$400.00" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Məhsulu çək
        const productRes = await fetch(`http://localhost:3000/products/${id}`);
        if (!productRes.ok) throw new Error("Məhsul tapılmadı");
        const productData = await productRes.json();

        // Mapping
        const formattedProduct = {
          ...productData,
          image: productData.image || "https://via.placeholder.com/500",
          images:
            productData.images && productData.images.length > 0
              ? productData.images
              : [productData.image],
          originalPrice: productData.oldPrice,
          reviewCount: productData.reviewsCount || 0,
          colors: productData.colors || [],
          specs: productData.specs || {},
        };

        setProduct(formattedProduct);
        setSelectedImage(formattedProduct.image);
        if (formattedProduct.colors.length > 0)
          setSelectedColor(formattedProduct.colors[0]);

        // 2. Oxşar məhsulları çək (Eyni kateqoriyadan)
        const relatedRes = await fetch(
          `http://localhost:3000/products?category=${formattedProduct.category}&id_ne=${id}&_limit=4`,
        );
        const relatedData = await relatedRes.json();

        // Related products mapping
        const mappedRelated = relatedData.map((p) => ({
          ...p,
          originalPrice: p.oldPrice,
          reviewCount: p.reviewsCount || 0,
        }));

        setRelatedProducts(mappedRelated);
      } catch (error) {
        console.error("Xəta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0); // Səhifə açilanda yuxarı qalx
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`${product.name} səbətə əlavə olundu!`);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Məhsul tapılmadı.
      </div>
    );

  // Qiymət hesablanması (Storage seçiminə görə)
  const currentStoragePrice =
    storageOptions.find((s) => s.label === selectedStorage)?.price || 0;
  const finalPrice = product.price + currentStoragePrice;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 pt-6 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <ArrowRight size={14} />
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <ArrowRight size={14} />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* LEFT: Images (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] bg-[#F3F4F6] rounded-[24px] overflow-hidden flex items-center justify-center relative border border-gray-100">
              {product.isNew && (
                <span className="absolute top-5 left-5 bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-full">
                  New
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-5 right-5 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                1/4
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-2xl bg-[#F3F4F6] border-2 overflow-hidden ${selectedImage === img ? "border-blue-600" : "border-transparent hover:border-gray-300"}`}
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

          {/* RIGHT: Info (5 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded uppercase tracking-wider">
                {product.brand}
              </span>
              {product.stock > 0 && (
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <CheckCircle size={12} /> In Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-black text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-[#10B981] text-white text-xs font-bold px-2 py-1 rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[#10B981] text-sm font-medium">
                10% off - Limited time offer
              </p>
            </div>

            {/* Selectors */}
            <div className="space-y-6 mb-8">
              {/* Color */}
              {product.colors.length > 0 && (
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-3">
                    Color:{" "}
                    <span className="text-gray-500 font-normal">
                      {selectedColor}
                    </span>
                  </span>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedColor === color ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage (Static UI for Design match) */}
              <div>
                <span className="block text-sm font-bold text-gray-900 mb-3">
                  Storage
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {storageOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedStorage(opt.label)}
                      className={`p-3 rounded-xl border text-left transition-all ${selectedStorage === opt.label ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <span className="block text-sm font-bold text-gray-900">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {opt.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="block text-sm font-bold text-gray-900 mb-3">
                  Quantity
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Zap size={20} /> Buy Now
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <button className="flex items-center gap-2 hover:text-gray-900">
                <Heart size={18} /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 hover:text-gray-900">
                <Share2 size={18} /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 space-y-3 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Lock size={18} className="text-green-500" /> Secure checkout
                with SSL encryption
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={18} className="text-green-500" /> Free shipping on
                orders over $50
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={18} className="text-green-500" /> 30-day return
                policy
              </div>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Technical Specifications
          </h2>
          <p className="text-gray-500 mb-8">
            Detailed specifications and features of this product
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {Object.entries(product.specs).length > 0 ? (
                Object.entries(product.specs).map(([key, value], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-5 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <span className="col-span-1 font-semibold text-gray-900">
                      {key}
                    </span>
                    <span className="col-span-2 text-gray-600">{value}</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Məlumat yoxdur
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Review Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <span className="text-6xl font-black text-gray-900">
                    {product.rating}
                  </span>
                  <div className="text-left">
                    <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      Based on {product.reviewCount} reviews
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 w-12">
                        <Star
                          size={12}
                          fill="#9CA3AF"
                          className="text-gray-400"
                        />{" "}
                        {star}
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full"
                          style={{
                            width:
                              star === 5 ? "78%" : star === 4 ? "16%" : "3%",
                          }}
                        ></div>
                      </div>
                      <div className="w-8 text-right text-gray-500">
                        {star === 5 ? "78%" : star === 4 ? "16%" : "3%"}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">
                  Showing 3 reviews
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-full bg-[#3B82F6] text-white text-sm font-medium">
                    Recent
                  </button>
                  <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
                    Helpful
                  </button>
                </div>
              </div>

              {/* Mock Review 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <h4 className="font-bold text-gray-900">
                      Unbelievable Power
                    </h4>
                    <span className="text-xs text-gray-500">
                      by Alex S. • 2025-11-01
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Switched from PC, never looking back. The speed and display
                  quality are unmatched. Worth every penny.
                </p>
              </div>

              {/* Mock Review 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                      <Star size={16} className="text-gray-300" />
                    </div>
                    <h4 className="font-bold text-gray-900">
                      Great, but pricey
                    </h4>
                    <span className="text-xs text-gray-500">
                      by Maria K. • 2025-10-25
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Performs flawlessly for video editing. My only minor complaint
                  is the high initial cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDED PRODUCTS */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recommended Products
          </h2>
          <p className="text-gray-500 mb-8">You might also like these items</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  {...prod}
                  onAddToCart={() => toast.success("Added to cart")}
                />
              ))
            ) : (
              <p className="text-gray-500">No recommendations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
