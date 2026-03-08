import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CategoryRevenueChart = ({ orders, products }) => {
  const { t } = useTranslation();

  // Build product → category lookup and compute revenue per category
  const categoryData = (() => {
    const productMap = {};
    products.forEach((p) => {
      productMap[p.id] = p.category || "Other";
    });

    const catRevenue = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const cat = productMap[item.productId] || "Other";
            catRevenue[cat] =
              (catRevenue[cat] || 0) + (item.price || 0) * (item.quantity || 1);
          });
        } else {
          // If no items breakdown, attribute to "Other"
          const cat = "Other";
          catRevenue[cat] = (catRevenue[cat] || 0) + (order.total || 0);
        }
      });

    return Object.entries(catRevenue)
      .map(([name, revenue]) => ({
        name: name.length > 14 ? name.slice(0, 14) + "…" : name,
        fullName: name,
        revenue: Math.round(revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  })();

  const COLORS = [
    "var(--color-primary)",
    "var(--color-ring)",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">
            {payload[0].payload.fullName}
          </p>
          <p className="text-[12px] text-primary mt-[2px]">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) return null;

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="mb-[20px]">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("dashboard.categoryRevenue")}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-[2px]">
          {t("dashboard.topCategories")}
        </p>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              horizontal={false}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(v) =>
                `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={20}>
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  style={{ opacity: 0.85 }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryRevenueChart;
