import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ stat }) => (
  <div className="bg-white rounded-[16px] p-[20px] border border-[#E5E7EB]">
    <div className="flex items-center justify-between mb-[16px]">
      <div
        className={`w-[48px] h-[48px] rounded-[12px] bg-linear-to-br ${stat.color} flex items-center justify-center`}
      >
        <stat.icon className="w-[24px] h-[24px] text-white" />
      </div>
      <div
        className={`flex items-center gap-[4px] text-[13px] font-medium ${
          stat.positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {stat.positive ? (
          <ArrowUpRight className="w-[16px] h-[16px]" />
        ) : (
          <ArrowDownRight className="w-[16px] h-[16px]" />
        )}
        {stat.change}
      </div>
    </div>
    <p className="text-[24px] font-bold text-[#111827]">{stat.value}</p>
    <p className="text-[14px] text-[#6B7280] mt-[4px]">{stat.title}</p>
  </div>
);

export default StatCard;
