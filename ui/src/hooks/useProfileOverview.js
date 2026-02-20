import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { ShoppingBag, Package, DollarSign, Heart } from "lucide-react";

export const useProfileOverview = () => {
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

  return {
    user,
    isLoading,
    statCards,
    recentOrders,
    getStatusColor,
    getStatusText,
  };
};
