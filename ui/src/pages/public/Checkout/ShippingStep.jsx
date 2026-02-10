import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Plus, Check, Home, Building2, Loader2, X } from "lucide-react";
import { addressService } from "@/services/addressService";

const ShippingStep = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded,
  userId,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Azerbaijan",
    phone: "",
    isDefault: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAddress = await addressService.create({
        ...formData,
        userId,
      });
      onAddressAdded(newAddress);
      setShowModal(false);
      setFormData({
        label: "Home",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Azerbaijan",
        phone: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-[24px]">
        <h2 className="text-[24px] font-bold text-foreground mb-[8px]">
          {t("checkout.step1")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("checkout.selectAddress")}
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-[40px]">
          <MapPin className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[16px]" />
          <p className="text-[16px] text-muted-foreground mb-[20px]">
            {t("address.noAddresses")}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-[18px] h-[18px]" />
            {t("address.addNew")}
          </button>
        </div>
      ) : (
        <div className="space-y-[16px]">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address.id)}
              className={`relative p-[20px] rounded-[16px] border-2 cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`absolute top-[20px] right-[20px] w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedAddressId === address.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {selectedAddressId === address.id && (
                  <Check className="w-[14px] h-[14px] text-primary-foreground" />
                )}
              </div>

              {address.isDefault && (
                <span className="absolute top-[20px] left-[20px] px-[10px] py-[4px] bg-primary text-primary-foreground text-[11px] font-medium rounded-full">
                  {t("address.defaultAddress")}
                </span>
              )}

              <div className="flex items-start gap-[16px] mt-[8px]">
                <div className="w-[48px] h-[48px] bg-muted rounded-[12px] flex items-center justify-center shrink-0">
                  {address.label === "Home" ? (
                    <Home className="w-[22px] h-[22px] text-muted-foreground" />
                  ) : (
                    <Building2 className="w-[22px] h-[22px] text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-semibold text-foreground mb-[4px]">
                    {address.label === "Home"
                      ? t("address.home")
                      : t("address.work")}
                  </p>
                  <p className="text-[14px] text-foreground">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-[14px] text-muted-foreground mt-[4px]">
                    {address.address}
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {address.country}
                  </p>
                  <p className="text-[14px] text-muted-foreground mt-[4px]">
                    {address.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowModal(true)}
            className="w-full p-[20px] rounded-[16px] border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-[8px] text-muted-foreground hover:text-primary"
          >
            <Plus className="w-[20px] h-[20px]" />
            <span className="font-medium">{t("address.addNew")}</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-card rounded-[24px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto border border-border shadow-lg">
            <div className="p-[24px] border-b border-border flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-foreground">
                {t("address.addNew")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-[8px] hover:bg-muted rounded-[8px]"
              >
                <X className="w-[20px] h-[20px] text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[24px] space-y-[16px]">
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-[14px] text-[14px] font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-[12px] transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-[14px] text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-[12px] transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px]"
                >
                  {isSubmitting && (
                    <Loader2 className="w-[16px] h-[16px] animate-spin" />
                  )}
                  {t("common.add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingStep;
