import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { addressService } from "@/services/addressService";

export const useMyAddresses = () => {
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
        country: "",
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

  return {
    addresses,
    isLoading,
    showModal,
    editingAddress,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleSetDefault,
  };
};
