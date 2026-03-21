import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { orderService } from "@/services/orderService";
import { Package, ChevronRight, Loader2 } from "lucide-react";

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: t("home.viewAll") },
    { key: "pending", label: t("order.ordered") },
    { key: "processing", label: t("order.processing") },
    { key: "shipped", label: t("order.shipped") },
    { key: "delivered", label: t("order.delivered") },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await orderService.getByStatus(user.id, activeFilter);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id, activeFilter]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-warning/10 text-warning",
      processing: "bg-info/10 text-info",
      shipped: "bg-primary/10 text-primary",
      delivered: "bg-success/10 text-success",
      cancelled: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: t("order.ordered"),
      processing: t("order.processing"),
      shipped: t("order.shipped"),
      delivered: t("order.delivered"),
      cancelled: t("order.cancelled"),
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateStr) => {
    const locale = i18n.language === "az" ? "az-AZ" : "en-US";
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.myOrders")} - TechVibe</title>
      </Helmet>
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <h1 className="text-[24px] font-bold text-foreground mb-[8px]">
          {t("profile.myOrders")}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {t("order.trackOrder")}
        </p>
      </div>

      <div className="flex flex-wrap gap-[8px]">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-[16px] py-[10px] rounded-[12px] text-[14px] font-medium transition-colors ${
              activeFilter === filter.key
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-[20px] shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Package className="w-[48px] h-[48px] text-muted-foreground mb-[16px]" />
            <p className="text-[16px] font-medium text-muted-foreground">
              {t("profile.noOrders")}
            </p>
            <Link
              to="/"
              className="mt-[16px] text-[14px] text-primary hover:underline"
            >
              {t("profile.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/profile/orders/${order.id}`}
                className="flex items-center justify-between p-[24px] hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-[12px] bg-muted border border-border flex items-center justify-center overflow-hidden">
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-[24px] h-[24px] text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground mb-[4px]">
                      {order.orderNumber}
                    </p>
                    <p className="text-[14px] text-muted-foreground">
                      {formatDate(order.createdAt)} • {order.items.length}{" "}
                      {t("order.items")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[16px]">
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-foreground">
                      {formatPrice(order.total || 0)}
                    </p>
                    <span
                      className={`inline-flex px-[12px] py-[4px] rounded-full text-[12px] font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <ChevronRight className="w-[20px] h-[20px] text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
