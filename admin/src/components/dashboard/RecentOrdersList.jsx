import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecentOrdersList = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB]">
      <div className="flex items-center justify-between p-[20px] border-b border-[#E5E7EB]">
        <h2 className="text-[16px] font-semibold text-[#111827]">
          {t("dashboard.recentOrders")}
        </h2>
        <Link
          to="/orders"
          className="text-[14px] font-medium text-[#3B82F6] hover:text-[#2563EB]"
        >
          {t("common.viewAll")}
        </Link>
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-[16px] hover:bg-[#F9FAFB]"
            >
              <div>
                <p className="text-[14px] font-medium text-[#111827]">
                  #{order.orderNumber || order.id}
                </p>
                <p className="text-[13px] text-[#6B7280]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-[#111827]">
                  ${order.total?.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))
        ) : (
          <div className="p-[40px] text-center text-[#6B7280]">
            {t("dashboard.noOrdersFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersList;
