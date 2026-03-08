import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Eye, Package } from "lucide-react";

const ProductsTable = ({ products, getCategoryName, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-secondary border-b border-border">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("products.productName")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("products.category")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("products.price")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("products.stock")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("products.rating")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-secondary">
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center gap-[12px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[44px] h-[44px] rounded-[10px] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                {getCategoryName(product.categoryId)}
              </td>
              <td className="px-[16px] py-[14px]">
                <p className="text-[14px] font-semibold text-foreground">
                  ${product.price}
                </p>
                {product.discount > 0 && (
                  <p className="text-[12px] text-destructive">
                    -{product.discount}%
                  </p>
                )}
              </td>
              <td className="px-[16px] py-[14px]">
                <span
                  className={`px-[8px] py-[3px] rounded-full text-[11px] font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-700"
                      : product.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock > 10
                    ? t("products.inStock")
                    : product.stock > 0
                      ? t("products.lowStock")
                      : t("products.outOfStock")}{" "}
                  ({product.stock})
                </span>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[#F59E0B]">★</span>
                  {product.rating?.toFixed(1) || "—"}
                </div>
              </td>
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center justify-end gap-[6px]">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-[7px] hover:bg-accent rounded-[6px]"
                  >
                    <Edit className="w-[16px] h-[16px] text-muted-foreground" />
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-[7px] hover:bg-red-50 rounded-[6px]"
                  >
                    <Trash2 className="w-[16px] h-[16px] text-destructive" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
