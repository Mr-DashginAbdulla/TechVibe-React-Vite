import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package, ChevronRight } from "lucide-react";

const RecentOrdersList = ({ recentOrders, getStatusColor, getStatusText }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[18px] font-semibold text-foreground">
          {t("profile.recentOrders")}
        </h2>
        <Link
          to="/profile/orders"
          className="flex items-center gap-[4px] text-[14px] text-primary hover:underline"
        >
          {t("home.viewAll")}
          <ChevronRight className="w-[16px] h-[16px]" />
        </Link>
      </div>
      {recentOrders.length === 0 ? (
        <p className="text-[15px] text-muted-foreground text-center py-[40px]">
          {t("profile.noOrders")}
        </p>
      ) : (
        <div className="space-y-[12px]">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              to={`/profile/orders/${order.id}`}
              className="flex items-center justify-between p-[16px] rounded-[12px] bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[10px] bg-card border border-border flex items-center justify-center overflow-hidden">
                  {order.items[0]?.image ? (
                    <img
                      src={order.items[0].image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-[20px] h-[20px] text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {order.items?.length || 0} {t("order.items")} • $
                    {(order.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <span
                className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium ${getStatusColor(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrdersList;
