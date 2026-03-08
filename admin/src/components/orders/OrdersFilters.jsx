import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrdersFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-[10px]">
      <div className="relative flex-1">
        <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
        <input
          type="text"
          placeholder={t("orders.searchOrders")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-[40px] pr-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
      >
        <option value="">{t("orders.allStatuses")}</option>
        <option value="pending">{t("orders.pending")}</option>
        <option value="processing">{t("orders.processing")}</option>
        <option value="shipped">{t("orders.shipped")}</option>
        <option value="delivered">{t("orders.delivered")}</option>
        <option value="cancelled">{t("orders.cancelled")}</option>
      </select>
    </div>
  );
};

export default OrdersFilters;
