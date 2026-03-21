import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AOVChart = ({ orders }) => {
  const { t } = useTranslation();
  const { formatPrice, symbols, currency } = useCurrency();

  const monthlyAOV = (() => {
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d >= month && d < nextMonth && o.status !== "cancelled";
      });

      const totalRevenue = monthOrders.reduce(
        (sum, o) => sum + (o.total || 0),
        0,
      );
      const aov =
        monthOrders.length > 0
          ? Math.round((totalRevenue / monthOrders.length) * 100) / 100
          : 0;

      data.push({
        label: month.toLocaleDateString(undefined, { month: "short" }),
        aov,
        orders: monthOrders.length,
      });
    }

    return data;
  })();

  // Calculate overall AOV
  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const overallAOV =
    activeOrders.length > 0
      ? (
          activeOrders.reduce((sum, o) => sum + (o.total || 0), 0) /
          activeOrders.length
        ).toFixed(2)
      : "0.00";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">{label}</p>
          <p className="text-[12px] text-primary mt-[2px]">
            AOV: {formatPrice(payload[0].value)}
          </p>
          <p className="text-[12px] text-muted-foreground mt-px">
            {payload[0].payload.orders} {t("dashboard.orders")}
          </p>
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
            {t("dashboard.avgOrderValue")}
          </h2>
          <p className="text-[13px] text-muted-foreground mt-[2px]">
            {t("dashboard.overall")}: {formatPrice(overallAOV)}
          </p>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyAOV}
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
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(v) => `${v} ${symbols[currency]}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="aov"
              fill="var(--color-ring)"
              radius={[6, 6, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AOVChart;
