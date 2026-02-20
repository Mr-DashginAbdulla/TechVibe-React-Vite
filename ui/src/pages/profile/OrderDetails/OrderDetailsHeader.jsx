import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Edit3, RefreshCw } from "lucide-react";

const OrderDetailsHeader = ({
  order,
  formatDate,
  getStatusText,
  canCancelOrder,
  canEditOrder,
  onCancel,
  onEdit,
  onReorder,
  isReordering,
}) => {
  const { t } = useTranslation();

  const statusColorClass =
    order.status === "delivered"
      ? "bg-success/10 text-success"
      : order.status === "shipped"
        ? "bg-primary/10 text-primary"
        : order.status === "processing"
          ? "bg-info/10 text-info"
          : order.status === "cancelled"
            ? "bg-destructive/10 text-destructive"
            : "bg-warning/10 text-warning";

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[16px] sm:p-[24px]">
      <Link
        to="/profile/orders"
        className="inline-flex items-center gap-[8px] text-[14px] text-muted-foreground hover:text-primary mb-[16px]"
      >
        <ArrowLeft className="w-[16px] h-[16px]" />
        {t("order.backToOrders")}
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground mb-[4px]">
            {order.orderNumber}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-muted-foreground">
            {t("order.orderDate")}: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-[8px] sm:gap-[12px]">
          <span
            className={`px-[12px] sm:px-[16px] py-[6px] sm:py-[8px] rounded-full text-[13px] sm:text-[14px] font-medium ${statusColorClass}`}
          >
            {getStatusText(order.status)}
          </span>
          {canCancelOrder && (
            <button
              onClick={onCancel}
              className="px-[10px] sm:px-[12px] py-[6px] sm:py-[8px] text-[12px] sm:text-[13px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              {t("order.cancelOrder")}
            </button>
          )}
          {canEditOrder && (
            <button
              onClick={onEdit}
              className="flex items-center gap-[6px] px-[10px] sm:px-[12px] py-[6px] sm:py-[8px] text-[12px] sm:text-[13px] font-medium text-info hover:bg-info/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-[14px] h-[14px]" />
              {t("order.editOrder")}
            </button>
          )}
          <button
            onClick={onReorder}
            disabled={isReordering}
            className="flex items-center gap-[6px] px-[10px] sm:px-[12px] py-[6px] sm:py-[8px] text-[12px] sm:text-[13px] font-medium text-success hover:bg-success/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-[14px] h-[14px] ${isReordering ? "animate-spin" : ""}`}
            />
            {isReordering ? t("common.loading") : t("order.reorder")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsHeader;
