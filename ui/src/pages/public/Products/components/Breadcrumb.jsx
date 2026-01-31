import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ productName, category }) => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-blue-600 transition-colors">
        {t("productDetails.home")}
      </Link>
      <ChevronRight size={14} className="text-gray-400" />
      <Link to="/products" className="hover:text-blue-600 transition-colors">
        {t("productDetails.products")}
      </Link>
      {category && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <Link
            to={`/products?category=${category}`}
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {category}
          </Link>
        </>
      )}
      <ChevronRight size={14} className="text-gray-400" />
      <span className="text-gray-900 font-medium truncate max-w-[200px]">
        {productName}
      </span>
    </nav>
  );
};

export default Breadcrumb;
