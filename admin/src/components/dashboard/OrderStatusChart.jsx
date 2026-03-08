import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_COLORS = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

const OrderStatusChart = ({ orders }) => {
  const { t } = useTranslation();

  const statusData = (() => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({
        name: t(`orders.${status}`),
        value: count,
        status,
        color: STATUS_COLORS[status] || "#6B7280",
      }))
      .sort((a, b) => b.value - a.value);
  })();

  const total = statusData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">
            {data.name}
          </p>
          <p className="text-[12px] text-muted-foreground mt-[2px]">
            {data.value} {t("dashboard.orders")} (
            {((data.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="mb-[16px]">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("dashboard.ordersByStatus")}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-[2px]">
          {total} {t("dashboard.totalOrdersLabel")}
        </p>
      </div>

      <div className="flex items-center gap-[20px]">
        <div className="w-[180px] h-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-[10px]">
          {statusData.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-[8px]">
                <div
                  className="w-[10px] h-[10px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[13px] text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-[13px] font-semibold text-foreground">
                  {item.value}
                </span>
                <span className="text-[11px] text-muted-foreground w-[40px] text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
