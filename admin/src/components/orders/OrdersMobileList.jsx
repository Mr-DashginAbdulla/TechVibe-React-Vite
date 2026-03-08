import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";

const OrdersMobileList = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <div className="p-[40px] text-center">
        <ShoppingCart className="w-[40px] h-[40px] text-muted-foreground mx-auto mb-[10px]" />
        <p className="text-[14px] text-muted-foreground">
          {t("orders.noOrders")}
        </p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-border">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="block p-[14px] hover:bg-secondary"
        >
          <div className="flex items-center justify-between mb-[6px]">
            <span className="text-[14px] font-semibold text-foreground">
              #{order.orderNumber || order.id}
            </span>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">
              {order.customer?.name || order.userId}
            </span>
            <span className="text-[14px] font-semibold text-foreground">
              ${order.total?.toFixed(2)}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-[4px]">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default OrdersMobileList;
