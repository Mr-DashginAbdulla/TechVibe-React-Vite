import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const BRAND_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#6366F1",
];

const BrandRevenueChart = ({ orders, products }) => {
  const { t } = useTranslation();

  const brandData = (() => {
    const productMap = {};
    products.forEach((p) => {
      productMap[p.id] = p.brand || "Other";
    });

    const brandRevenue = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const brand = productMap[item.productId] || "Other";
            brandRevenue[brand] =
              (brandRevenue[brand] || 0) +
              (item.price || 0) * (item.quantity || 1);
          });
        } else {
          brandRevenue["Other"] =
            (brandRevenue["Other"] || 0) + (order.total || 0);
        }
      });

    return Object.entries(brandRevenue)
      .map(([name, revenue]) => ({
        name,
        value: Math.round(revenue * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  })();

  const total = brandData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-[10px] px-[14px] py-[10px] shadow-lg">
          <p className="text-[13px] font-semibold text-foreground">
            {data.name}
          </p>
          <p className="text-[12px] text-primary mt-[2px]">
            ${data.value.toLocaleString()} (
            {total > 0 ? ((data.value / total) * 100).toFixed(1) : 0}%)
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
          {t("dashboard.revenueByBrand")}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-[2px]">
          {t("dashboard.topBrands")}
        </p>
      </div>

      <div className="h-[260px]">
        {brandData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={brandData}
                cx="50%"
                cy="45%"
                outerRadius={85}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--color-card)"
              >
                {brandData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-[12px] text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[13px] text-muted-foreground bg-muted/20 rounded-[8px] border border-dashed border-border">
            {t("dashboard.noOrdersFound") || "No orders found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandRevenueChart;
