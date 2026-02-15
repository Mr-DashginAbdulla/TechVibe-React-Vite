import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopProductsList = ({ products }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB]">
      <div className="flex items-center justify-between p-[20px] border-b border-[#E5E7EB]">
        <h2 className="text-[16px] font-semibold text-[#111827]">
          {t("dashboard.topProducts")}
        </h2>
        <Link
          to="/products"
          className="text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB]"
        >
          {t("common.viewAll")}
        </Link>
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-[12px] p-[16px] hover:bg-[#F9FAFB]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[48px] h-[48px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#111827] truncate">
                {product.name}
              </p>
              <p className="text-[13px] text-[#6B7280]">{product.brand}</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold text-[#111827]">
                ${product.price}
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
