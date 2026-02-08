import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { orderService, productService, userService } from "@/services/api";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, users, products] = await Promise.all([
          orderService.getAll(),
          userService.getAll(),
          productService.getAll(),
        ]);

        // Calculate total revenue from completed orders
        const totalRevenue = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.total || 0), 0);

        // Get recent orders
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Get top products by rating
        const topProducts = [...products]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.filter(
            (u) => u.role !== "admin" && u.role !== "super-admin",
          ).length,
          totalProducts: products.length,
          recentOrders,
          topProducts,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: t("dashboard.totalRevenue"),
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "from-[#10B981] to-[#059669]",
      change: "+12%",
      positive: true,
    },
    {
      title: t("dashboard.orders"),
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-[#3B82F6] to-[#2563EB]",
      change: "+8%",
      positive: true,
    },
    {
      title: t("dashboard.users"),
      value: stats.totalUsers,
      icon: Users,
      color: "from-[#8B5CF6] to-[#7C3AED]",
      change: "+23%",
      positive: true,
    },
    {
      title: t("dashboard.products"),
      value: stats.totalProducts,
      icon: Package,
      color: "from-[#F59E0B] to-[#D97706]",
      change: "+5%",
      positive: true,
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      pending: t("orders.pending"),
      processing: t("orders.processing"),
      shipped: t("orders.shipped"),
      delivered: t("orders.delivered"),
      cancelled: t("orders.cancelled"),
    };
    return (
      <span
        className={`px-[10px] py-[4px] rounded-full text-[12px] font-medium ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#111827]">
          {t("dashboard.title")}
        </h1>
        <p className="text-[14px] text-[#6B7280] mt-[4px]">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-[16px] p-[20px] border border-[#E5E7EB]"
          >
            <div className="flex items-center justify-between mb-[16px]">
              <div
                className={`w-[48px] h-[48px] rounded-[12px] bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-[24px] h-[24px] text-white" />
              </div>
              <div
                className={`flex items-center gap-[4px] text-[13px] font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="w-[16px] h-[16px]" />
                ) : (
                  <ArrowDownRight className="w-[16px] h-[16px]" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-[24px] font-bold text-[#111827]">{stat.value}</p>
            <p className="text-[14px] text-[#6B7280] mt-[4px]">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        {/* Recent Orders */}
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
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
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

        {/* Top Products */}
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
            {stats.topProducts.map((product) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
