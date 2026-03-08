import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const StatCard = ({ stat }) => {
  // Generate sparkline data from stat.sparkline or synthetic data
  const sparklineData = stat.sparkline || [
    { v: 30 },
    { v: 45 },
    { v: 35 },
    { v: 50 },
    { v: 40 },
    { v: 55 },
    { v: 65 },
  ];

  return (
    <div className="bg-card rounded-[16px] p-[20px] border border-border group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-[12px]">
        <div
          className={`w-[44px] h-[44px] rounded-[12px] bg-linear-to-br ${stat.color} flex items-center justify-center`}
        >
          <stat.icon className="w-[22px] h-[22px] text-white" />
        </div>
        <div
          className={`flex items-center gap-[3px] text-[12px] font-semibold px-[8px] py-[3px] rounded-full ${
            stat.positive
              ? "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
              : "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {stat.positive ? (
            <ArrowUpRight className="w-[14px] h-[14px]" />
          ) : (
            <ArrowDownRight className="w-[14px] h-[14px]" />
          )}
          {stat.change}
        </div>
      </div>
      <p className="text-[22px] font-bold text-foreground">{stat.value}</p>
      <p className="text-[13px] text-muted-foreground mt-[2px]">{stat.title}</p>

      {/* Mini sparkline */}
      <div className="h-[32px] mt-[12px] opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient
                id={`spark-${stat.title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
            <Area
              type="monotone"
              dataKey="v"
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              fill={`url(#spark-${stat.title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatCard;
