import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/store/api/productsApi";
import { useAuth } from "@/context/AuthContext";

const Basket = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: cartItems = [], isLoading } = useGetCartQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem({ id: item.id, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId).unwrap();
      toast.success(t("basket.itemRemoved"));
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(t("basket.emptyCartError"));
      return;
    }
    navigate("/checkout");
  };

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("basket.loginRequired")}
        </h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          {t("basket.loginRequiredDesc")}
        </p>
        <Link
          to="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {t("auth.signIn")}
        </Link>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <ShoppingCart size={56} className="text-blue-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">😢</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("basket.emptyTitle")}
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          {t("basket.emptyDesc")}
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          {t("basket.startShopping")}
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>
          {cartItems.length > 0
            ? `${t("basket.title")} (${cartItems.length}) | TechVibe`
            : `${t("basket.title")} | TechVibe`}
        </title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("basket.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <Link
                to={`/product/${item.productId}`}
                className="shrink-0 w-24 h-24 bg-gray-50 rounded-xl overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  ${(item.price || 0).toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, (item.quantity || 1) - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, (item.quantity || 1) + 1)
                      }
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("basket.orderSummary")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>{t("basket.subtotal")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t("basket.shipping")}</span>
                <span className="text-emerald-600 font-medium">
                  {t("basket.free")}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>{t("basket.total")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {t("basket.checkout")}
              <ArrowRight size={18} />
            </button>

            <Link
              to="/"
              className="block text-center text-blue-600 font-medium mt-4 hover:underline"
            >
              {t("basket.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
