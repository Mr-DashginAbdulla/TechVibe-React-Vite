import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

const OrdersMobileList = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <div className="p-[40px] text-center">
        <ShoppingCart className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
        <p className="text-[14px] text-[#6B7280]">{t("orders.noOrders")}</p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-[#E5E7EB]">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="block p-[14px] hover:bg-[#F9FAFB]"
        >
          <div className="flex items-center justify-between mb-[6px]">
            <span className="text-[14px] font-semibold text-[#111827]">
              #{order.orderNumber || order.id}
            </span>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">
              {order.customer?.name || order.userId}
            </span>
            <span className="text-[14px] font-semibold text-[#111827]">
              ${order.total?.toFixed(2)}
            </span>
          </div>
          <p className="text-[12px] text-[#9CA3AF] mt-[4px]">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default OrdersMobileList;
