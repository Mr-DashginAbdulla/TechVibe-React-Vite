import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ productName, category }) => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-primary transition-colors">
        {t("productDetails.home")}
      </Link>
      <ChevronRight size={14} className="text-muted-foreground/50" />
      <Link to="/shop" className="hover:text-primary transition-colors">
        {t("productDetails.products")}
      </Link>
      {category && (
        <>
          <ChevronRight size={14} className="text-muted-foreground/50" />
          <Link
            to={`/shop?category=${category}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {t(`categories.${category}`)}
          </Link>
        </>
      )}
      <ChevronRight size={14} className="text-muted-foreground/50" />
      <span className="text-foreground font-medium truncate max-w-[200px]">
        {productName}
      </span>
    </nav>
  );
};

export default Breadcrumb;
