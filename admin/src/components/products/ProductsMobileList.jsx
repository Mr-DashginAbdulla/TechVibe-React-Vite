import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { Edit, Trash2, Package } from "lucide-react";

const ProductsMobileList = ({ products, getCategoryName, onDelete }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  if (products.length === 0) {
    return (
      <div className="p-[40px] text-center">
        <Package className="w-[40px] h-[40px] text-muted-foreground mx-auto mb-[10px]" />
        <p className="text-[14px] text-muted-foreground">
          {t("products.noProducts")}
        </p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-border">
      {products.map((product) => (
        <div key={product.id} className="p-[14px]">
          <div className="flex items-start gap-[12px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-[56px] h-[56px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-foreground truncate">
                {product.name}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {product.brand} · {getCategoryName(product.categoryId)}
              </p>
              <div className="flex items-center justify-between mt-[6px]">
                <span className="text-[14px] font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-[6px]">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-[6px] bg-accent rounded-[6px]"
                  >
                    <Edit className="w-[14px] h-[14px] text-muted-foreground" />
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-[6px] bg-red-50 rounded-[6px]"
                  >
                    <Trash2 className="w-[14px] h-[14px] text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsMobileList;
