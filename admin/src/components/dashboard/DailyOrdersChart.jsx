import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DailyOrdersChart = ({ orders }) => {
  const { t } = useTranslation();

  const dailyData = (() => {
    const now = new Date();
    const data = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        return orderDate === dateStr;
      });

      data.push({
        date: dateStr,
        label: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        orders: dayOrders.length,
        revenue:
          Math.round(
            dayOrders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.total || 0), 0) * 100,
          ) / 100,
      });
    }

    return data;
  })();

  const totalOrders = dailyData.reduce((sum, d) => sum + d.orders, 0);
  const avgPerDay = totalOrders > 0 ? (totalOrders / 30).toFixed(1) : "0";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">{label}</p>
          <p className="text-[12px] text-primary mt-[2px]">
            {payload[0].value} {t("dashboard.orders")}
          </p>
          {payload[1] && (
            <p className="text-[12px] text-muted-foreground mt-px">
              ${payload[1].value.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h2 className="text-[16px] font-semibold text-foreground">
            {t("dashboard.dailyOrders")}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-[2px]">
            {t("dashboard.last30Days")} · {t("dashboard.avgPerDay")}:{" "}
            {avgPerDay}
          </p>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-primary)" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-ring)"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
              activeDot={{ r: 4, fill: "var(--color-ring)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyOrdersChart;
