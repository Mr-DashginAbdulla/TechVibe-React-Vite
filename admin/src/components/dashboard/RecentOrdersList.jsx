import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecentOrdersList = ({ orders, getStatusBadge }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[16px] border border-border">
      <div className="flex items-center justify-between p-[20px] border-b border-border">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("dashboard.recentOrders")}
        </h2>
        <Link
          to="/orders"
          className="text-[14px] font-medium text-primary hover:text-primary/80"
        >
          {t("common.viewAll")}
        </Link>
      </div>
      <div className="divide-y divide-border">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-[16px] hover:bg-secondary"
            >
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  #{order.orderNumber || order.id}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-foreground">
                  ${order.total?.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))
        ) : (
          <div className="p-[40px] text-center text-muted-foreground">
            {t("dashboard.noOrdersFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersList;
