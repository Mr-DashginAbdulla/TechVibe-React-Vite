import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ orders }) => {
  const { t } = useTranslation();
  const { formatPrice, symbols, currency } = useCurrency();

  // Group orders by month and calculate revenue
  const monthlyData = (() => {
    const months = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { month: key, revenue: 0, orders: 0 };
    }

    // Aggregate order data
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        const d = new Date(order.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (months[key]) {
          months[key].revenue += order.total || 0;
          months[key].orders += 1;
        }
      });

    return Object.values(months).map((m) => ({
      ...m,
      label: new Date(m.month + "-01").toLocaleDateString(undefined, {
        month: "short",
      }),
      revenue: Math.round(m.revenue * 100) / 100,
    }));
  })();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">{label}</p>
          <p className="text-[12px] text-primary mt-[2px]">
            {t("dashboard.revenue")}: {formatPrice(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-[12px] text-muted-foreground mt-px">
              {t("dashboard.orders")}: {payload[1].value}
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
            {t("dashboard.revenueOverview")}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-[2px]">
            {t("dashboard.last6Months")}
          </p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(v) =>
                `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} ${symbols[currency]}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--color-ring)"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
