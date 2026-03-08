import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const OrdersTable = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-secondary border-b border-border">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.orderNumber")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.customer")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.items")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.total")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.status")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("orders.date")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-secondary">
              <td className="px-[16px] py-[14px] text-[14px] font-medium text-foreground">
                #{order.orderNumber || order.id}
              </td>
              <td className="px-[16px] py-[14px]">
                <p className="text-[14px] text-foreground">
                  {order.customer?.name || order.userId}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {order.customer?.email}
                </p>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                {order.items?.length || 0}
              </td>
              <td className="px-[16px] py-[14px] text-[14px] font-semibold text-foreground">
                ${order.total?.toFixed(2)}
              </td>
              <td className="px-[16px] py-[14px]">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-[16px] py-[14px] text-[13px] text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-[16px] py-[14px] text-right">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-[6px] px-[12px] py-[6px] text-[13px] font-medium text-primary hover:bg-primary/10 rounded-[8px]"
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
