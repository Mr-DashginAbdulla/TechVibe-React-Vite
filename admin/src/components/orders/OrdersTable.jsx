import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const OrdersTable = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.orderNumber")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.customer")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.items")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.total")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.status")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("orders.date")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-[#F9FAFB]">
              <td className="px-[16px] py-[14px] text-[14px] font-medium text-[#111827]">
                #{order.orderNumber || order.id}
              </td>
              <td className="px-[16px] py-[14px]">
                <p className="text-[14px] text-[#111827]">
                  {order.customer?.name || order.userId}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  {order.customer?.email}
                </p>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#374151]">
                {order.items?.length || 0}
              </td>
              <td className="px-[16px] py-[14px] text-[14px] font-semibold text-[#111827]">
                ${order.total?.toFixed(2)}
              </td>
              <td className="px-[16px] py-[14px]">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-[16px] py-[14px] text-[13px] text-[#6B7280]">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-[16px] py-[14px] text-right">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-[#3B82F6] hover:bg-[#EFF6FF] rounded-[8px]"
                >
                  <Eye className="w-[14px] h-[14px]" />
                  {t("orders.viewDetails")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
