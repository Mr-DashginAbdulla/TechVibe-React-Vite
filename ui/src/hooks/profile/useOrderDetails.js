import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showToast as toast } from "@/components/shared/StyledToast";
import { orderService } from "@/services/orderService";
import { useAuth } from "@/context/AuthContext";
import {
  useAddToCartMutation,
  useClearCartMutation,
} from "@/store/api/apiSlice";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

export const useOrderDetails = (id) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [addToCart] = useAddToCartMutation();
  const [clearCart] = useClearCartMutation();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const canCancelOrder =
    order && ["pending", "processing"].includes(order.status);

  const canEditOrder = order && order.status === "pending";

  const getStatusIcon = (status) => {
    const icons = {
      ordered: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReorder = async () => {
    if (!user || !order) return;

    setIsReordering(true);
    try {
      await clearCart(user.id);

      for (const item of order.items) {
        await addToCart({
          userId: user.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || {},
        });
      }

      toast.success(t("order.itemsAddedToCart"));
      navigate("/checkout");
    } catch (error) {
      toast.error(t("order.reorderError"));
    } finally {
      setIsReordering(false);
    }
  };

  const handleEditOrder = () => {
    if (!canEditOrder) return;

    navigate("/checkout", {
      state: {
        editOrderId: order.id,
        editOrderItems: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || {},
        })),
      },
    });
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(id);
      toast.success(t("order.orderCancelled"));

      const updatedOrder = await orderService.getById(id);
      setOrder(updatedOrder);
      setShowCancelConfirm(false);
    } catch (error) {
      toast.error(error.message || t("order.cancelError"));
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    order,
    isLoading,
    isCancelling,
    isReordering,
    showCancelConfirm,
    setShowCancelConfirm,
    canCancelOrder,
    canEditOrder,
    getStatusIcon,
    getStatusText,
    formatDate,
    handleReorder,
    handleEditOrder,
    handleCancelOrder,
  };
};
