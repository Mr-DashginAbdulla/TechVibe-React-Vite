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
        <h2 className="text-[24px] font-bold text-[#111827] mb-[8px]">
          {t("checkout.step1")}
        </h2>
        <p className="text-[15px] text-[#6B7280]">
          {t("checkout.selectAddress")}
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-[40px]">
          <MapPin className="w-[48px] h-[48px] text-[#9CA3AF] mx-auto mb-[16px]" />
          <p className="text-[16px] text-[#6B7280] mb-[20px]">
            {t("address.noAddresses")}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-[#3B82F6] text-white font-semibold rounded-[12px] hover:bg-[#2563EB] transition-colors"
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
                  ? "border-[#3B82F6] bg-blue-50/50"
                  : "border-[#E5E7EB] hover:border-[#3B82F6]/50"
              }`}
            >
              {/* Selection indicator */}
              <div
                className={`absolute top-[20px] right-[20px] w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedAddressId === address.id
                    ? "border-[#3B82F6] bg-[#3B82F6]"
                    : "border-[#D1D5DB]"
                }`}
              >
                {selectedAddressId === address.id && (
                  <Check className="w-[14px] h-[14px] text-white" />
                )}
              </div>

              {/* Default badge */}
              {address.isDefault && (
                <span className="absolute top-[20px] left-[20px] px-[10px] py-[4px] bg-[#3B82F6] text-white text-[11px] font-medium rounded-full">
                  {t("address.defaultAddress")}
                </span>
              )}

              <div className="flex items-start gap-[16px] mt-[8px]">
                <div className="w-[48px] h-[48px] bg-[#F3F4F6] rounded-[12px] flex items-center justify-center shrink-0">
                  {address.label === "Home" ? (
                    <Home className="w-[22px] h-[22px] text-[#6B7280]" />
                  ) : (
                    <Building2 className="w-[22px] h-[22px] text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-semibold text-[#111827] mb-[4px]">
                    {address.label === "Home"
                      ? t("address.home")
                      : t("address.work")}
                  </p>
                  <p className="text-[14px] text-[#374151]">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-[14px] text-[#6B7280] mt-[4px]">
                    {address.address}
                  </p>
                  <p className="text-[14px] text-[#6B7280]">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-[14px] text-[#6B7280]">
                    {address.country}
                  </p>
                  <p className="text-[14px] text-[#6B7280] mt-[4px]">
                    {address.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add new address button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full p-[20px] rounded-[16px] border-2 border-dashed border-[#D1D5DB] hover:border-[#3B82F6] hover:bg-blue-50/30 transition-colors flex items-center justify-center gap-[8px] text-[#6B7280] hover:text-[#3B82F6]"
          >
            <Plus className="w-[20px] h-[20px]" />
            <span className="font-medium">{t("address.addNew")}</span>
          </button>
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-[24px] border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#111827]">
                {t("address.addNew")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-[8px] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                <X className="w-[20px] h-[20px] text-[#6B7280]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[24px] space-y-[16px]">
              {/* Label selection */}
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
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
                          ? "bg-[#3B82F6] text-white"
                          : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                      }`}
                    >
                      {label === "Home" ? t("address.home") : t("address.work")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("auth.firstName")}
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("auth.lastName")}
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                  {t("address.addressLine")}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("address.city")}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("address.state")}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              {/* ZIP & Phone */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("address.zipCode")}
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    {t("profile.phone")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-[14px] py-[12px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-[14px] text-[14px] font-semibold text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[12px] transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-[14px] text-[14px] font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-[12px] transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px]"
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
