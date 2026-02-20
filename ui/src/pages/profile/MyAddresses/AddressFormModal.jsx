import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const AddressFormModal = ({
  editingAddress,
  formData,
  setFormData,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
      <div className="bg-card rounded-[24px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-[24px] border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">
            {editingAddress ? t("address.editAddress") : t("address.addNew")}
          </h2>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-muted rounded-[8px]"
          >
            <X className="w-[20px] h-[20px] text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-[24px] space-y-[16px]">
          <div>
            <label className="block text-[14px] font-medium text-foreground mb-[8px]">
              {t("order.status")}
            </label>
            <div className="flex gap-[8px]">
              {["Home", "Office"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData({ ...formData, label })}
                  className={`flex-1 py-[12px] rounded-[10px] text-[14px] font-medium transition-colors ${
                    formData.label === label
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {label === "Home" ? t("address.home") : t("address.work")}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("auth.firstName")}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("auth.lastName")}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-medium text-foreground mb-[8px]">
              {t("address.addressLine")}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("address.city")}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("address.state")}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("address.zipCode")}
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-foreground mb-[8px]">
                {t("profile.phone")}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-[14px] py-[12px] border border-input bg-background rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />
            </div>
          </div>
          <div className="flex gap-[12px] pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-[14px] text-[14px] font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-[12px] transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 py-[14px] text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-[12px] transition-colors"
            >
              {editingAddress ? t("common.save") : t("common.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
