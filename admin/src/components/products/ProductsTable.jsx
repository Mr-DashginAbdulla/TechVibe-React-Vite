import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Eye, Package } from "lucide-react";

const ProductsTable = ({ products, getCategoryName, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("products.productName")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("products.category")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("products.price")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("products.stock")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("products.rating")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-[#F9FAFB]">
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center gap-[12px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[44px] h-[44px] rounded-[10px] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#111827] truncate">
                      {product.name}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#374151]">
                {getCategoryName(product.categoryId)}
              </td>
              <td className="px-[16px] py-[14px]">
                <p className="text-[14px] font-semibold text-[#111827]">
                  ${product.price}
                </p>
                {product.discount > 0 && (
                  <p className="text-[12px] text-[#EF4444]">
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
              <td className="px-[16px] py-[14px] text-[14px] text-[#374151]">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[#F59E0B]">★</span>
                  {product.rating?.toFixed(1) || "—"}
                </div>
              </td>
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center justify-end gap-[6px]">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-[7px] hover:bg-[#F3F4F6] rounded-[6px]"
                  >
                    <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-[7px] hover:bg-red-50 rounded-[6px]"
                  >
                    <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
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
