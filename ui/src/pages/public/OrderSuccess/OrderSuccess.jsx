import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { useOrderSuccess } from "@/hooks/profile/useOrderSuccess";
import OrderSuccessHeader from "./OrderSuccessHeader";
import OrderInfoBar from "./OrderInfoBar";
import OrderItemsList from "./OrderItemsList";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderStatusTracker from "./OrderStatusTracker";
import OrderSummarySide from "./OrderSummarySide";

const OrderSuccess = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { order, isLoading, estimatedDelivery } = useOrderSuccess(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-[48px] h-[48px] text-primary animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("checkout.orderConfirmed")} - TechVibe</title>
      </Helmet>

      <div className="max-w-[1000px] mx-auto px-[16px] py-[48px]">
        <OrderSuccessHeader />

        <OrderInfoBar order={order} estimatedDelivery={estimatedDelivery} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          <div className="lg:col-span-2 space-y-[24px]">
            <OrderItemsList items={order.items} />
            <OrderShippingInfo shippingAddress={order.shippingAddress} />
            <OrderStatusTracker />
          </div>

          <div className="lg:col-span-1">
            <OrderSummarySide order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
