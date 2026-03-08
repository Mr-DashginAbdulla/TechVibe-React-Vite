import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { orderService, productService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import OrderItemsList from "@/components/orders/OrderItemsList";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderSidebar from "@/components/orders/OrderSidebar";

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const currentStatus = order.status;
      const isSoldStatus = (status) =>
        !["pending", "cancelled"].includes(status);

      // Determine if stock should change
      let stockMultiplier = 0;
      if (!isSoldStatus(currentStatus) && isSoldStatus(newStatus)) {
        // Pending/Cancelled -> Sold (Decrease stock)
        stockMultiplier = -1;
      } else if (isSoldStatus(currentStatus) && !isSoldStatus(newStatus)) {
        // Sold -> Pending/Cancelled (Increase stock)
        // Wait, moving back to pending shouldn't happen logically usually, but if it does, return stock.
        // And importantly, Sold -> Cancelled returns stock.
        stockMultiplier = 1;
      }

      // Update stock for each item if needed
      if (stockMultiplier !== 0) {
        await Promise.all(
          order.items.map(async (item) => {
            const product = await productService.getById(item.productId);
            if (product) {
              const newStock = product.stock + item.quantity * stockMultiplier;
              await productService.update(item.productId, {
                stock: newStock >= 0 ? newStock : 0,
              });
            }
          }),
        );
      }

      const newTimelineEntry = {
        status: newStatus,
        date: new Date().toISOString(),
        note: "Status updated by admin",
      };

      const updatedTimeline = [...(order.timeline || []), newTimelineEntry];

      await orderService.updateStatus(id, newStatus, updatedTimeline);
      setOrder({ ...order, status: newStatus, timeline: updatedTimeline });
      toast.success(t("orders.statusUpdated"));
    } catch (error) {
      console.error(error);
      toast.error(t("orders.statusError"));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-[10px] py-[4px] rounded-full text-[12px] font-medium ${styles[status] || styles.pending}`}
      >
        {t(`orders.${status}`) || status}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  if (!order) {
    return (
      <div className="text-center py-[60px]">
        <p className="text-[16px] text-muted-foreground">
          {t("orders.notFound")}
        </p>
        <Link to="/orders" className="text-primary mt-[12px] inline-block">
          {t("common.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      <div className="flex items-center gap-[16px]">
        <Link to="/orders" className="p-[10px] hover:bg-accent rounded-[10px]">
          <ArrowLeft className="w-[20px] h-[20px] text-foreground" />
        </Link>
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground">
            {t("orders.orderDetails")} #{order.orderNumber || order.id}
          </h1>
          <div className="flex items-center gap-[10px] mt-[4px]">
            {getStatusBadge(order.status)}
            <span className="text-[13px] text-muted-foreground">
              {t("orders.createdAt")}{" "}
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
        <div className="lg:col-span-2 space-y-[16px]">
          <OrderItemsList items={order.items} />
          <OrderTimeline history={order.timeline} />
        </div>
        <OrderSidebar
          order={order}
          onStatusUpdate={updateStatus}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
};

export default OrderDetail;
