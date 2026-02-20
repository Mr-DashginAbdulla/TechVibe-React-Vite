import { useTranslation } from "react-i18next";

const OrderTimeline = ({ timeline, getStatusIcon, formatDate }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <h3 className="text-[16px] font-semibold text-foreground mb-[20px]">
        {t("order.trackOrder")}
      </h3>
      <div className="space-y-[20px]">
        {timeline.map((event, index) => {
          const Icon = getStatusIcon(event.status);
          const isLast = index === timeline.length - 1;
          return (
            <div key={index} className="flex gap-[16px]">
              <div className="flex flex-col items-center">
                <div
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${
                    isLast
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-[2px] h-[24px] bg-muted mt-[8px]"></div>
                )}
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  {event.description}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
