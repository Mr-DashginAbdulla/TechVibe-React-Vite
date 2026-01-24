import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { Package, ChevronRight, Loader2 } from "lucide-react";

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
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
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
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

      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
        <h1 className="text-[24px] font-bold text-[#111827] mb-[8px]">
          {t("profile.myOrders")}
        </h1>
        <p className="text-[15px] text-[#6B7280]">{t("order.trackOrder")}</p>
      </div>

      <div className="flex flex-wrap gap-[8px]">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-[16px] py-[10px] rounded-[12px] text-[14px] font-medium transition-colors ${
              activeFilter === filter.key
                ? "bg-[#3B82F6] text-white"
                : "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-[32px] h-[32px] text-[#3B82F6] animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Package className="w-[48px] h-[48px] text-[#9CA3AF] mb-[16px]" />
            <p className="text-[16px] font-medium text-[#6B7280]">
              {t("profile.noOrders")}
            </p>
            <Link
              to="/"
              className="mt-[16px] text-[14px] text-[#3B82F6] hover:underline"
            >
              {t("profile.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/profile/orders/${order.id}`}
                className="flex items-center justify-between p-[24px] hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-[12px] bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-[24px] h-[24px] text-[#9CA3AF]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-[#111827] mb-[4px]">
                      {order.orderNumber}
                    </p>
                    <p className="text-[14px] text-[#6B7280]">
                      {formatDate(order.createdAt)} • {order.items.length}{" "}
                      {t("order.items")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[16px]">
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-[#111827]">
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex px-[12px] py-[4px] rounded-full text-[12px] font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <ChevronRight className="w-[20px] h-[20px] text-[#9CA3AF]" />
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
