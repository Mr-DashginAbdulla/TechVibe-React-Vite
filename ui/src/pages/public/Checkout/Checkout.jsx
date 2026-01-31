import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Construction, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Checkout | TechVibe</title>
      </Helmet>

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <Construction size={40} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Coming Soon</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          The checkout page is under construction. Please check back later!
        </p>
        <Link
          to="/profile/cart"
          className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>
      </div>
    </>
  );
};

export default Checkout;
