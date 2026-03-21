import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

const TopProductsList = ({ products }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-card rounded-[16px] border border-border">
      <div className="flex items-center justify-between p-[20px] border-b border-border">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("dashboard.topProducts")}
        </h2>
        <Link
          to="/products"
          className="text-[14px] font-medium text-primary hover:text-primary/80"
        >
          {t("common.viewAll")}
        </Link>
      </div>
      <div className="divide-y divide-border">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-[12px] p-[16px] hover:bg-secondary"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[48px] h-[48px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground truncate">
                {product.name}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {product.brand}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold text-foreground">
                {formatPrice(product.price)}
              </p>
              <div className="flex items-center gap-[4px] text-[13px] text-[#F59E0B]">
                <span>★</span>
                <span>{product.rating?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsList;
