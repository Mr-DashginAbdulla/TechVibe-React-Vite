import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { useMyAddresses } from "@/hooks/profile/useMyAddresses";
import AddressesHeader from "./AddressesHeader";
import AddressCard from "./AddressCard";
import EmptyAddresses from "./EmptyAddresses";
import AddressFormModal from "./AddressFormModal";

const MyAddresses = () => {
  const { t } = useTranslation();
  const {
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
  } = useMyAddresses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.myAddresses")} - TechVibe</title>
      </Helmet>

      <AddressesHeader onAddNew={() => handleOpenModal()} />

      {addresses.length === 0 ? (
        <EmptyAddresses onAddNew={() => handleOpenModal()} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddressFormModal
          editingAddress={editingAddress}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MyAddresses;
