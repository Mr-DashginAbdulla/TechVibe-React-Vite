import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { addressService } from "@/services/addressService";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Home,
  Building2,
} from "lucide-react";

const MyAddresses = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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

  useEffect(() => {
    fetchAddresses();
  }, [user?.id]);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      const data = await addressService.getByUserId(user.id);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        label: "Home",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Azerbaijan",
        phone: user?.phone || "",
        isDefault: addresses.length === 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressService.update(editingAddress.id, formData);
      } else {
        await addressService.create({ ...formData, userId: user.id });
      }
      await fetchAddresses();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("common.confirm") + "?")) return;
    try {
      await addressService.delete(id);
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefault(id, user.id);
      await fetchAddresses();
    } catch (error) {
      console.error("Error setting default:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px] flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] mb-[4px]">
            {t("profile.myAddresses")}
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            {t("order.shippingAddress")}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-[8px] px-[20px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors"
        >
          <Plus className="w-[18px] h-[18px]" />
          {t("address.addNew")}
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[60px] text-center">
          <MapPin className="w-[48px] h-[48px] text-[#9CA3AF] mx-auto mb-[16px]" />
          <p className="text-[16px] font-medium text-[#6B7280]">
            {t("address.noAddresses")}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-[16px] text-[#3B82F6] hover:underline"
          >
            {t("address.addFirstAddress")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-[20px] shadow-sm border-2 p-[24px] relative ${
                address.isDefault ? "border-[#3B82F6]" : "border-[#E5E7EB]"
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-[16px] right-[16px] px-[10px] py-[4px] bg-[#3B82F6] text-white text-[11px] font-medium rounded-full">
                  {t("address.defaultAddress")}
                </span>
              )}
              <div className="flex items-center gap-[12px] mb-[16px]">
                <div className="w-[44px] h-[44px] bg-[#F3F4F6] rounded-[12px] flex items-center justify-center">
                  {address.label === "Home" ? (
                    <Home className="w-[20px] h-[20px] text-[#6B7280]" />
                  ) : (
                    <Building2 className="w-[20px] h-[20px] text-[#6B7280]" />
                  )}
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-[#111827]">
                    {address.label === "Home"
                      ? t("address.home")
                      : t("address.work")}
                  </p>
                  <p className="text-[13px] text-[#6B7280]">
                    {address.firstName} {address.lastName}
                  </p>
                </div>
              </div>
              <div className="text-[14px] text-[#374151] space-y-[4px] mb-[20px]">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
                <p className="text-[#6B7280]">{address.phone}</p>
              </div>
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => handleOpenModal(address)}
                  className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[8px] transition-colors"
                >
                  <Edit2 className="w-[14px] h-[14px]" />
                  {t("common.edit")}
                </button>
                {!address.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-[#3B82F6] bg-blue-50 hover:bg-blue-100 rounded-[8px] transition-colors"
                    >
                      <Check className="w-[14px] h-[14px]" />
                      {t("address.setDefault")}
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-[6px] px-[14px] py-[8px] text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-[8px] transition-colors"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-[24px] border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#111827]">
                {editingAddress
                  ? t("address.editAddress")
                  : t("address.addNew")}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-[8px] hover:bg-[#F3F4F6] rounded-[8px]"
              >
                <X className="w-[20px] h-[20px] text-[#6B7280]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[24px] space-y-[16px]">
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
              <div className="flex gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-[14px] text-[14px] font-semibold text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[12px] transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-[14px] text-[14px] font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-[12px] transition-colors"
                >
                  {editingAddress ? t("common.save") : t("common.add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddresses;
