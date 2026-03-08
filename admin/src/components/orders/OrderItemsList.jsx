import { useTranslation } from "react-i18next";

const OrderItemsList = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[16px] border border-border">
      <div className="px-[20px] py-[16px] border-b border-border">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("orders.orderItems")}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {items?.map((item, index) => (
          <div key={index} className="flex items-center gap-[12px] p-[16px]">
            <img
              src={item.image}
              alt={item.name}
              className="w-[56px] h-[56px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground truncate">
                {item.name}
              </p>
              {item.color && (
                <p className="text-[12px] text-muted-foreground">
                  {item.color}
                </p>
              )}
              {item.memory && (
                <p className="text-[12px] text-muted-foreground">
                  {item.memory}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold text-foreground">
                ${item.price?.toFixed(2)}
              </p>
              <p className="text-[12px] text-muted-foreground">
                x{item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
