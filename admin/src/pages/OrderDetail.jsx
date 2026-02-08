import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { orderService } from "@/services/api";

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error) {
      toast.error(t("orders.notFound"));
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t("orders.pending"),
      processing: t("orders.processing"),
      shipped: t("orders.shipped"),
      delivered: t("orders.delivered"),
      cancelled: t("orders.cancelled"),
    };
    return labels[status] || status;
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const newTimeline = [
        ...(order.timeline || []),
        {
          status: newStatus,
          date: new Date().toISOString(),
          description: getStatusLabel(newStatus),
        },
      ];

      await orderService.updateStatus(id, newStatus, newTimeline);
      setOrder({ ...order, status: newStatus, timeline: newTimeline });
      toast.success(t("orders.statusUpdated"));
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
    delivered: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  if (!order) return null;

  const StatusIcon = statusConfig[order.status]?.icon || Clock;

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <button
            onClick={() => navigate("/orders")}
            className="p-[10px] hover:bg-[#F3F4F6] rounded-[10px]"
          >
            <ArrowLeft className="w-[20px] h-[20px] text-[#374151]" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#111827]">
              {t("orders.orderNumber")} #{order.orderNumber || order.id}
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              {t("orders.createdAt")}{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-[8px] px-[16px] py-[10px] rounded-[12px] ${statusConfig[order.status]?.bg}`}
        >
          <StatusIcon
            className={`w-[20px] h-[20px] ${statusConfig[order.status]?.color}`}
          />
          <span
            className={`text-[14px] font-semibold ${statusConfig[order.status]?.color}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Left Column - Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-[24px]">
          {/* Order Items */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB]">
            <div className="p-[20px] border-b border-[#E5E7EB]">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                {t("orders.orderItems")}
              </h2>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-[16px] p-[20px]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[64px] h-[64px] rounded-[12px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#111827]">
                      {item.name}
                    </p>
                    <p className="text-[13px] text-[#6B7280]">
                      {t("orders.quantity")}: {item.quantity}
                    </p>
                  </div>
                  <p className="text-[16px] font-semibold text-[#111827]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
            <h2 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
              {t("orders.orderHistory")}
            </h2>
            <div className="space-y-[16px]">
              {order.timeline?.map((event, idx) => {
                const Icon = statusConfig[event.status]?.icon || Clock;
                return (
                  <div key={idx} className="flex gap-[16px]">
                    <div
                      className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${statusConfig[event.status]?.bg}`}
                    >
                      <Icon
                        className={`w-[20px] h-[20px] ${statusConfig[event.status]?.color}`}
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#111827]">
                        {event.description}
                      </p>
                      <p className="text-[13px] text-[#6B7280]">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="space-y-[24px]">
          {/* Status Update */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
            <h2 className="text-[16px] font-semibold text-[#111827] mb-[16px]">
              {t("orders.updateStatus")}
            </h2>
            <div className="grid grid-cols-2 gap-[8px]">
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || order.status === status}
                  className={`px-[12px] py-[10px] rounded-[10px] text-[13px] font-medium transition-all ${
                    order.status === status
                      ? `${statusConfig[status]?.bg} ${statusConfig[status]?.color}`
                      : "border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                  } disabled:opacity-50`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <User className="w-[20px] h-[20px] text-[#6B7280]" />
              <h2 className="text-[16px] font-semibold text-[#111827]">
                {t("orders.customer")}
              </h2>
            </div>
            <p className="text-[14px] text-[#111827] font-medium">
              {order.shippingAddress?.firstName}{" "}
              {order.shippingAddress?.lastName}
            </p>
            <p className="text-[13px] text-[#6B7280] mt-[4px]">
              {order.shippingAddress?.phone}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <MapPin className="w-[20px] h-[20px] text-[#6B7280]" />
              <h2 className="text-[16px] font-semibold text-[#111827]">
                {t("orders.shippingAddress")}
              </h2>
            </div>
            <p className="text-[14px] text-[#374151]">
              {order.shippingAddress?.address}
            </p>
            <p className="text-[14px] text-[#374151]">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.zipCode}
            </p>
            <p className="text-[14px] text-[#374151]">
              {order.shippingAddress?.country}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <CreditCard className="w-[20px] h-[20px] text-[#6B7280]" />
              <h2 className="text-[16px] font-semibold text-[#111827]">
                {t("orders.orderSummary")}
              </h2>
            </div>
            <div className="space-y-[12px]">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6B7280]">{t("orders.subtotal")}</span>
                <span className="text-[#111827]">
                  ${order.subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6B7280]">{t("orders.shipping")}</span>
                <span className="text-[#111827]">
                  ${order.shippingCost?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6B7280]">{t("orders.tax")}</span>
                <span className="text-[#111827]">${order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6B7280]">{t("orders.discount")}</span>
                  <span className="text-green-600">
                    -${order.discount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-[12px] border-t border-[#E5E7EB] flex justify-between">
                <span className="text-[16px] font-semibold text-[#111827]">
                  {t("orders.total")}
                </span>
                <span className="text-[18px] font-bold text-[#3B82F6]">
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
