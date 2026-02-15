import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Package } from "lucide-react";

const ProductsMobileList = ({ products, getCategoryName, onDelete }) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="p-[40px] text-center">
        <Package className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
        <p className="text-[14px] text-[#6B7280]">{t("products.noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-[#E5E7EB]">
      {products.map((product) => (
        <div key={product.id} className="p-[14px]">
          <div className="flex items-start gap-[12px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-[56px] h-[56px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#111827] truncate">
                {product.name}
              </p>
              <p className="text-[12px] text-[#6B7280]">
                {product.brand} · {getCategoryName(product.categoryId)}
              </p>
              <div className="flex items-center justify-between mt-[6px]">
                <span className="text-[14px] font-bold text-[#111827]">
                  ${product.price}
                </span>
                <div className="flex items-center gap-[6px]">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-[6px] bg-[#F3F4F6] rounded-[6px]"
                  >
                    <Edit className="w-[14px] h-[14px] text-[#6B7280]" />
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-[6px] bg-red-50 rounded-[6px]"
                  >
                    <Trash2 className="w-[14px] h-[14px] text-[#EF4444]" />
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
