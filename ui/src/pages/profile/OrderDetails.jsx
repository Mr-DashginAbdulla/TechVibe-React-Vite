import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { orderService } from "@/services/orderService";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";

const OrderDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-[80px]">
        <p className="text-[16px] text-[#6B7280]">{t("profile.noOrders")}</p>
        <Link
          to="/profile/orders"
          className="text-[#3B82F6] hover:underline mt-[8px] inline-block"
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
      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-[8px] text-[14px] text-[#6B7280] hover:text-[#3B82F6] mb-[16px]"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          {t("order.backToOrders")}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#111827] mb-[4px]">
              {order.orderNumber}
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              {t("order.orderDate")}: {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-[16px] py-[8px] rounded-full text-[14px] font-medium ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "shipped"
                  ? "bg-purple-100 text-purple-700"
                  : order.status === "processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[20px]">
            {t("order.items")}
          </h2>
          <div className="space-y-[16px]">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-[16px] p-[16px] bg-[#F9FAFB] rounded-[12px]"
              >
                <div className="w-[80px] h-[80px] rounded-[10px] bg-white border border-[#E5E7EB] overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-[24px] h-[24px] text-[#9CA3AF]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-[#111827]">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-[#6B7280]">
                    {item.brand} • {item.color}
                  </p>
                  <div className="flex items-center justify-between mt-[8px]">
                    <p className="text-[13px] text-[#6B7280]">
                      {t("product.quantity")}: {item.quantity}
                    </p>
                    <p className="text-[16px] font-bold text-[#111827]">
                      ${(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] pt-[20px] border-t border-[#E5E7EB] space-y-[12px]">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#6B7280]">{t("cart.subtotal")}</span>
              <span className="text-[#111827]">
                ${(order.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#6B7280]">{t("cart.shipping")}</span>
              <span className="text-[#111827]">
                ${(order.shipping || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[16px] font-bold pt-[12px] border-t border-[#E5E7EB]">
              <span className="text-[#111827]">{t("cart.total")}</span>
              <span className="text-[#3B82F6]">
                ${(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-[24px]">
          <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-[10px] flex items-center justify-center">
                <MapPin className="w-[18px] h-[18px] text-[#6B7280]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#111827]">
                {t("order.shippingAddress")}
              </h3>
            </div>
            <div className="text-[14px] text-[#374151] space-y-[4px]">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px]">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
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
                            ? "bg-[#3B82F6] text-white"
                            : "bg-[#E5E7EB] text-[#6B7280]"
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-[2px] h-[24px] bg-[#E5E7EB] mt-[8px]"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#111827]">
                        {event.description}
                      </p>
                      <p className="text-[12px] text-[#6B7280]">
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
    </div>
  );
};

export default OrderDetails;
