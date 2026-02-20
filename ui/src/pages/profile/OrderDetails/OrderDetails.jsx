import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { useOrderDetails } from "@/hooks/profile/useOrderDetails";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderItemsList from "./OrderItemsList";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderTimeline from "./OrderTimeline";
import CancelOrderModal from "./CancelOrderModal";

const OrderDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
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
  } = useOrderDetails(id);

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

      <OrderDetailsHeader
        order={order}
        formatDate={formatDate}
        getStatusText={getStatusText}
        canCancelOrder={canCancelOrder}
        canEditOrder={canEditOrder}
        onCancel={() => setShowCancelConfirm(true)}
        onEdit={handleEditOrder}
        onReorder={handleReorder}
        isReordering={isReordering}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <OrderItemsList
          items={order.items}
          subtotal={order.subtotal}
          shipping={order.shipping}
          total={order.total}
        />

        <div className="space-y-[24px]">
          <OrderShippingInfo shippingAddress={order.shippingAddress} />
          <OrderTimeline
            timeline={order.timeline}
            getStatusIcon={getStatusIcon}
            formatDate={formatDate}
          />
        </div>
      </div>

      {showCancelConfirm && (
        <CancelOrderModal
          isCancelling={isCancelling}
          onConfirm={handleCancelOrder}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
};

export default OrderDetails;
