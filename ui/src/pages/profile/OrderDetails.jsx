import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { orderService } from "@/services/orderService";
import { useAuth } from "@/context/AuthContext";
import {
  useAddToCartMutation,
  useClearCartMutation,
} from "@/store/api/productsApi";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
  XCircle,
  AlertTriangle,
  Edit3,
  RefreshCw,
} from "lucide-react";

const OrderDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
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

  const canCancelOrder =
    order && ["pending", "processing"].includes(order.status);

  const canEditOrder = order && order.status === "pending";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-[80px]">
        <p className="text-[16px] text-muted-foreground">
          {t("profile.noOrders")}
        </p>
        <Link
          to="/profile/orders"
          className="text-primary hover:underline mt-[8px] inline-block"
        >
          {t("order.backToOrders")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.orderDetails")} - TechVibe</title>
      </Helmet>
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-[8px] text-[14px] text-muted-foreground hover:text-primary mb-[16px]"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          {t("order.backToOrders")}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-foreground mb-[4px]">
              {order.orderNumber}
            </h1>
            <p className="text-[14px] text-muted-foreground">
              {t("order.orderDate")}: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-[12px]">
            <span
              className={`px-[16px] py-[8px] rounded-full text-[14px] font-medium ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : order.status === "shipped"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                    : order.status === "processing"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}
            >
              {getStatusText(order.status)}
            </span>
            {canCancelOrder && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-[12px] py-[8px] text-[13px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                {t("order.cancelOrder")}
              </button>
            )}
            {canEditOrder && (
              <button
                onClick={handleEditOrder}
                className="flex items-center gap-[6px] px-[12px] py-[8px] text-[13px] font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="w-[14px] h-[14px]" />
                {t("order.editOrder")}
              </button>
            )}
            <button
              onClick={handleReorder}
              disabled={isReordering}
              className="flex items-center gap-[6px] px-[12px] py-[8px] text-[13px] font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-[14px] h-[14px] ${isReordering ? "animate-spin" : ""}`}
              />
              {isReordering ? t("common.loading") : t("order.reorder")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2 bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
          <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
            {t("order.items")}
          </h2>
          <div className="space-y-[16px]">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-[16px] p-[16px] bg-muted/50 rounded-[12px]"
              >
                <div className="w-[80px] h-[80px] rounded-[10px] bg-card border border-border overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-[24px] h-[24px] text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-foreground">
                    {item.name}
                  </p>

                  {item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-[6px] mt-[4px]">
                        {Object.entries(item.selectedOptions).map(
                          ([key, value]) => {
                            if (!value) return null;
                            const displayValue =
                              value.label || value.value || value;
                            return (
                              <span
                                key={key}
                                className="inline-flex items-center gap-[4px] px-[6px] py-[2px] bg-muted rounded-[4px] text-[11px] text-muted-foreground"
                              >
                                {key === "color" && value.value && (
                                  <span
                                    className="w-[10px] h-[10px] rounded-full border border-gray-300 dark:border-gray-600"
                                    style={{ backgroundColor: value.value }}
                                  />
                                )}
                                {displayValue}
                              </span>
                            );
                          },
                        )}
                      </div>
                    )}
                  <p className="text-[13px] text-muted-foreground mt-[2px]">
                    {item.brand || ""} {item.color ? `• ${item.color}` : ""}
                  </p>
                  <div className="flex items-center justify-between mt-[8px]">
                    <p className="text-[13px] text-muted-foreground">
                      {t("product.quantity")}: {item.quantity}
                    </p>
                    <p className="text-[16px] font-bold text-foreground">
                      ${(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] pt-[20px] border-t border-border space-y-[12px]">
            <div className="flex justify-between text-[14px]">
              <span className="text-muted-foreground">
                {t("cart.subtotal")}
              </span>
              <span className="text-foreground">
                ${(order.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-muted-foreground">
                {t("cart.shipping")}
              </span>
              <span className="text-foreground">
                ${(order.shipping || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[16px] font-bold pt-[12px] border-t border-border">
              <span className="text-foreground">{t("cart.total")}</span>
              <span className="text-primary">
                ${(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-[24px]">
          <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[40px] h-[40px] bg-muted rounded-[10px] flex items-center justify-center">
                <MapPin className="w-[18px] h-[18px] text-muted-foreground" />
              </div>
              <h3 className="text-[16px] font-semibold text-foreground">
                {t("order.shippingAddress")}
              </h3>
            </div>
            <div className="text-[14px] text-foreground space-y-[4px]">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
            <h3 className="text-[16px] font-semibold text-foreground mb-[20px]">
              {t("order.trackOrder")}
            </h3>
            <div className="space-y-[20px]">
              {order.timeline.map((event, index) => {
                const Icon = getStatusIcon(event.status);
                const isLast = index === order.timeline.length - 1;
                return (
                  <div key={index} className="flex gap-[16px]">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${
                          isLast
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-[2px] h-[24px] bg-muted mt-[8px]"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground">
                        {event.description}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-card rounded-[20px] p-[24px] w-full max-w-[400px] shadow-xl border border-border">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-[24px] h-[24px] text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-foreground">
                  {t("order.cancelConfirmTitle")}
                </h3>
              </div>
            </div>
            <p className="text-[14px] text-muted-foreground mb-[24px]">
              {t("order.cancelConfirmMessage")}
            </p>
            <div className="flex gap-[12px]">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
                className="flex-1 px-[16px] py-[12px] bg-muted text-foreground font-semibold rounded-[12px] hover:bg-muted/80 transition-colors"
              >
                {t("common.no")}
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-[16px] py-[12px] bg-red-600 text-white font-semibold rounded-[12px] hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isCancelling ? t("common.loading") : t("order.confirmCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
