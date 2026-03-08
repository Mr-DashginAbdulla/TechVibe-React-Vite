import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

const OrderTimeline = ({ history }) => {
  const { t } = useTranslation();

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-card rounded-[16px] border border-border">
      <div className="px-[20px] py-[16px] border-b border-border">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("orders.orderHistory")}
        </h2>
      </div>
      <div className="p-[20px]">
        <div className="space-y-[16px]">
          {history.map((entry, index) => (
            <div key={index} className="flex gap-[12px]">
              <div className="flex flex-col items-center">
                <div className="w-[32px] h-[32px] bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-[16px] h-[16px] text-primary" />
                </div>
                {index < history.length - 1 && (
                  <div className="w-[2px] flex-1 bg-border mt-[4px]" />
                )}
              </div>
              <div className="pb-[12px]">
                <p className="text-[14px] font-medium text-foreground">
                  {entry.status}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {new Date(entry.date).toLocaleString()}
                </p>
                {entry.note && (
                  <p className="text-[13px] text-foreground mt-[4px]">
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
