import { useTranslation } from "react-i18next";

const UserFormModal = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
  isSuperAdmin,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
      <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-[17px] font-bold text-[#111827] mb-[16px]">
          {isEditing ? t("users.editUser") : t("users.addUser")}
        </h3>
        <form onSubmit={onSubmit} className="space-y-[12px]">
          <div className="grid grid-cols-2 gap-[10px]">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.firstName")} *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.lastName")} *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("users.email")} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("users.password")}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!isEditing}
              className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
          </div>
          {isSuperAdmin && (
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.role")}
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
              >
                <option value="user">{t("users.customer")}</option>
                <option value="admin">{t("users.admin")}</option>
              </select>
            </div>
          )}
          <div className="flex gap-[10px] pt-[6px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-[14px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px]"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-[14px] py-[10px] bg-[#3B82F6] text-white font-medium rounded-[10px]"
            >
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
