import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Check, Home, Building2 } from "lucide-react";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-card rounded-[20px] shadow-sm border-2 p-[24px] relative ${
        address.isDefault ? "border-primary" : "border-border"
      }`}
    >
      {address.isDefault && (
        <span className="absolute top-[16px] right-[16px] px-[10px] py-[4px] bg-primary text-primary-foreground text-[11px] font-medium rounded-full">
          {t("address.defaultAddress")}
        </span>
      )}
      <div className="flex items-center gap-[12px] mb-[16px]">
        <div className="w-[44px] h-[44px] bg-muted rounded-[12px] flex items-center justify-center">
          {address.label === "Home" ? (
            <Home className="w-[20px] h-[20px] text-muted-foreground" />
          ) : (
            <Building2 className="w-[20px] h-[20px] text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-foreground">
            {address.label === "Home" ? t("address.home") : t("address.work")}
          </p>
          <p className="text-[13px] text-muted-foreground">
            {address.firstName} {address.lastName}
          </p>
        </div>
      </div>
      <div className="text-[14px] text-foreground space-y-[4px] mb-[20px]">
        <p>{address.address}</p>
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
        <p className="text-muted-foreground">{address.phone}</p>
      </div>
      <div className="flex items-center gap-[8px]">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-foreground bg-muted hover:bg-muted/80 rounded-[8px] transition-colors"
        >
          <Edit2 className="w-[14px] h-[14px]" />
          {t("common.edit")}
        </button>
        {!address.isDefault && (
          <>
            <button
              onClick={() => onSetDefault(address.id)}
              className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-[8px] transition-colors"
            >
              <Check className="w-[14px] h-[14px]" />
              {t("address.setDefault")}
            </button>
            <button
              onClick={() => onDelete(address.id)}
              className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-destructive bg-destructive/10 hover:bg-destructive/15 rounded-[8px] transition-colors"
            >
              <Trash2 className="w-[14px] h-[14px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
