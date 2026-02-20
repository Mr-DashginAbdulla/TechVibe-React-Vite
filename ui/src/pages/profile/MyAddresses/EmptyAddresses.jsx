import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

const EmptyAddresses = ({ onAddNew }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[60px] text-center">
      <MapPin className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[16px]" />
      <p className="text-[16px] font-medium text-muted-foreground">
        {t("address.noAddresses")}
      </p>
      <button
        onClick={onAddNew}
        className="mt-[16px] text-primary hover:underline"
      >
        {t("address.addFirstAddress")}
      </button>
    </div>
  );
};

export default EmptyAddresses;
