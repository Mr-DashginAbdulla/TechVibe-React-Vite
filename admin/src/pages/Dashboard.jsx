import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  orderService,
  productService,
  userService,
  categoryService,
} from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrdersList from "@/components/dashboard/RecentOrdersList";
import TopProductsList from "@/components/dashboard/TopProductsList";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import CategoryRevenueChart from "@/components/dashboard/CategoryRevenueChart";
import LowStockAlert from "@/components/dashboard/LowStockAlert";

const Dashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, users, products, categories] = await Promise.all([
          orderService.getAll(),
          userService.getAll(),
          productService.getAll(),
          categoryService.getAll(),
        ]);

        const activeOrders = orders.filter((o) => o.status !== "cancelled");
        const totalRevenue = activeOrders.reduce(
          (sum, o) => sum + (o.total || 0),
          0,
        );
        const regularUsers = users.filter(
          (u) => u.role !== "admin" && u.role !== "super-admin",
        );

        // Build monthly sparkline data for stat cards
        const buildMonthlySparkline = (items, dateField, valueField) => {
          const now = new Date();
          const data = [];
          for (let i = 6; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(
              now.getFullYear(),
              now.getMonth() - i + 1,
              1,
            );
            const count = items.filter((item) => {
              const d = new Date(item[dateField]);
              return d >= month && d < nextMonth;
            });
            data.push({
              v: valueField
                ? count.reduce((s, c) => s + (c[valueField] || 0), 0)
                : count.length,
            });
          }
          return data;
        };

        setData({
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: regularUsers.length,
          totalProducts: products.length,
          orders,
          products,
          categories,
          recentOrders: [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
          topProducts: [...products]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5),
          sparklines: {
            revenue: buildMonthlySparkline(activeOrders, "createdAt", "total"),
            orders: buildMonthlySparkline(orders, "createdAt", null),
            users: buildMonthlySparkline(regularUsers, "createdAt", null),
            products: [
              { v: products.length - 5 },
              { v: products.length - 3 },
              { v: products.length - 2 },
              { v: products.length - 1 },
              { v: products.length },
              { v: products.length },
              { v: products.length },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
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
        className={`px-[10px] py-[3px] rounded-full text-[11px] font-semibold ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const statCards = [
    {
      title: t("dashboard.totalRevenue"),
      value: `$${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "from-[#10B981] to-[#059669]",
      change: "+12.5%",
      positive: true,
      sparkline: data.sparklines.revenue,
    },
    {
      title: t("dashboard.orders"),
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "from-[#3B82F6] to-[#2563EB]",
      change: "+8.2%",
      positive: true,
      sparkline: data.sparklines.orders,
    },
    {
      title: t("dashboard.users"),
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-[#8B5CF6] to-[#7C3AED]",
      change: "+23.1%",
      positive: true,
      sparkline: data.sparklines.users,
    },
    {
      title: t("dashboard.products"),
      value: data.totalProducts.toLocaleString(),
      icon: Package,
      color: "from-[#F59E0B] to-[#D97706]",
      change: "+5%",
      positive: true,
      sparkline: data.sparklines.products,
    },
  ];

  // Current greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("dashboard.goodMorning")
      : hour < 18
        ? t("dashboard.goodAfternoon")
        : t("dashboard.goodEvening");

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[8px]">
        <div>
          <h1 className="text-[24px] font-bold text-foreground">
            {greeting} 👋
          </h1>
          <p className="text-[14px] text-muted-foreground mt-[2px] flex items-center gap-[6px]">
            <TrendingUp className="w-[14px] h-[14px]" />
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-[6px] text-[13px] text-muted-foreground">
          <Clock className="w-[14px] h-[14px]" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row: Revenue + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[20px]">
        <div className="lg:col-span-3">
          <RevenueChart orders={data.orders} />
        </div>
        <div className="lg:col-span-2">
          <OrderStatusChart orders={data.orders} />
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <RecentOrdersList
          orders={data.recentOrders}
          getStatusBadge={getStatusBadge}
        />
        <TopProductsList products={data.topProducts} />
      </div>

      {/* Category Revenue + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <CategoryRevenueChart orders={data.orders} products={data.products} />
        <LowStockAlert products={data.products} />
      </div>
    </div>
  );
};

export default Dashboard;
