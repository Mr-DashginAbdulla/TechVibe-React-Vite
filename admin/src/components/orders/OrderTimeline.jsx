import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

const OrderTimeline = ({ history }) => {
  const { t } = useTranslation();

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB]">
      <div className="px-[20px] py-[16px] border-b border-[#E5E7EB]">
        <h2 className="text-[16px] font-semibold text-[#111827]">
          {t("orders.orderHistory")}
        </h2>
      </div>
      <div className="p-[20px]">
        <div className="space-y-[16px]">
          {history.map((entry, index) => (
            <div key={index} className="flex gap-[12px]">
              <div className="flex flex-col items-center">
                <div className="w-[32px] h-[32px] bg-[#EFF6FF] rounded-full flex items-center justify-center">
                  <Clock className="w-[16px] h-[16px] text-[#3B82F6]" />
                </div>
                {index < history.length - 1 && (
                  <div className="w-[2px] flex-1 bg-[#E5E7EB] mt-[4px]" />
                )}
              </div>
              <div className="pb-[12px]">
                <p className="text-[14px] font-medium text-[#111827]">
                  {entry.status}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  {new Date(entry.date).toLocaleString()}
                </p>
                {entry.note && (
                  <p className="text-[13px] text-[#374151] mt-[4px]">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
