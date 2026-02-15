import { useTranslation } from "react-i18next";

const OrderSidebar = ({ order, onStatusUpdate, getStatusBadge }) => {
  const { t } = useTranslation();

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-[16px]">
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
        <h3 className="text-[15px] font-semibold text-[#111827] mb-[12px]">
          {t("orders.updateStatus")}
        </h3>
        <div className="flex flex-wrap gap-[8px]">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onStatusUpdate(status)}
              className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium transition-colors ${
                order.status === status
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
              }`}
            >
              {t(`orders.${status}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
        <h3 className="text-[15px] font-semibold text-[#111827] mb-[12px]">
          {t("orders.customerInfo")}
        </h3>
        <div className="space-y-[8px] text-[14px]">
          <p className="text-[#111827] font-medium">{order.customer?.name}</p>
          <p className="text-[#6B7280]">{order.customer?.email}</p>
          <p className="text-[#6B7280]">{order.customer?.phone}</p>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
          <h3 className="text-[15px] font-semibold text-[#111827] mb-[12px]">
            {t("orders.shippingAddress")}
          </h3>
          <div className="text-[14px] text-[#6B7280] space-y-[4px]">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
        <h3 className="text-[15px] font-semibold text-[#111827] mb-[12px]">
          {t("orders.orderSummary")}
        </h3>
        <div className="space-y-[8px] text-[14px]">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">{t("orders.subtotal")}</span>
            <span className="text-[#111827]">
              ${order.subtotal?.toFixed(2) || order.total?.toFixed(2)}
            </span>
          </div>
          {order.shipping !== undefined && (
            <div className="flex justify-between">
              <span className="text-[#6B7280]">{t("orders.shipping")}</span>
              <span className="text-[#111827]">
                ${order.shipping?.toFixed(2)}
              </span>
            </div>
          )}
          {order.tax !== undefined && (
            <div className="flex justify-between">
              <span className="text-[#6B7280]">{t("orders.tax")}</span>
              <span className="text-[#111827]">${order.tax?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-[8px] border-t border-[#E5E7EB]">
            <span className="text-[#111827] font-semibold">
              {t("orders.grandTotal")}
            </span>
            <span className="text-[#111827] font-bold">
              ${order.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;
