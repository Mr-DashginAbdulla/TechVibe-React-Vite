import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import {
  ShoppingBag,
  Package,
  DollarSign,
  Heart,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ProfileOverview = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [statsData, ordersData] = await Promise.all([
          userService.getStats(user.id),
          orderService.getByUserId(user.id),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const statCards = [
    {
      name: t("profile.totalOrders"),
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      name: t("order.delivered"),
      value: stats?.delivered || 0,
      icon: Package,
      color: "green",
    },
    {
      name: t("profile.totalSpent"),
      value: `$${(stats?.totalSpent || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "purple",
    },
    {
      name: t("profile.wishlistItems"),
      value: stats?.wishlistItems || 0,
      icon: Heart,
      color: "pink",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.overview")} - TechVibe</title>
      </Helmet>
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <h1 className="text-[24px] font-bold text-foreground mb-[8px]">
          {t("messages.loginSuccess", { name: user?.firstName })} 👋
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {t("profile.overview")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-card rounded-[16px] shadow-sm border border-border p-[20px]"
          >
            <div
              className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center mb-[12px] ${
                stat.color === "blue"
                  ? "bg-blue-100 dark:bg-blue-900/20"
                  : stat.color === "green"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : stat.color === "purple"
                      ? "bg-purple-100 dark:bg-purple-900/20"
                      : "bg-pink-100 dark:bg-pink-900/20"
              }`}
            >
              <stat.icon
                className={`w-[22px] h-[22px] ${
                  stat.color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : stat.color === "green"
                      ? "text-green-600 dark:text-green-400"
                      : stat.color === "purple"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-pink-600 dark:text-pink-400"
                }`}
              />
            </div>
            <p className="text-[24px] font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-[13px] text-muted-foreground">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="text-[18px] font-semibold text-foreground">
              {t("profile.personalInfo")}
            </h2>
            <Link
              to="/profile/settings"
              className="text-[14px] text-primary hover:underline"
            >
              {t("common.edit")}
            </Link>
          </div>
          <div className="space-y-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
                <Mail className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">
                  {t("auth.email")}
                </p>
                <p className="text-[15px] font-medium text-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
                <Phone className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">
                  {t("profile.phone")}
                </p>
                <p className="text-[15px] font-medium text-foreground">
                  {user?.phone || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
          <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
            {t("profile.accountSettings")}
          </h2>
          <div className="space-y-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
                <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">
                  {t("profile.memberSince")}
                </p>
                <p className="text-[15px] font-medium text-foreground">
                  {user?.memberSince ||
                    new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
                <Shield className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground">
                  {t("order.status")}
                </p>
                <span
                  className={`inline-flex px-[10px] py-[4px] rounded-full text-[12px] font-medium ${
                    user?.isVerified
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {user?.isVerified ? "✓" : "!"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ProfileOverview;
