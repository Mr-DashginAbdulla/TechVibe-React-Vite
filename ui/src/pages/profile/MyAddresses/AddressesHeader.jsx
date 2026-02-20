import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

const AddressesHeader = ({ onAddNew }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px] flex items-center justify-between">
      <div>
        <h1 className="text-[24px] font-bold text-foreground mb-[4px]">
          {t("profile.myAddresses")}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          {t("order.shippingAddress")}
        </p>
      </div>
      <button
        onClick={onAddNew}
        className="flex items-center gap-[8px] px-[20px] py-[12px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        <Plus className="w-[18px] h-[18px]" />
        {t("address.addNew")}
      </button>
    </div>
  );
};

export default AddressesHeader;
