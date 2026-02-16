import { useState } from "react";
import { useTranslation } from "react-i18next";
import { validatePassword } from "@/utils/passwordValidation";

const UserFormModal = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
  isSuperAdmin,
}) => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    const needsPassword = !isEditing || formData.password;

    if (needsPassword && formData.password) {
      const result = validatePassword(formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      if (!result.isValid) {
        errors.password = result.errors.map((key) => t(`validation.${key}`));
      }
    } else if (!isEditing && !formData.password) {
      errors.password = [t("validation.passwordMinLength")];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSubmit(e);
  };

  const inputClass = (field) =>
    `w-full px-[12px] py-[10px] bg-[#F9FAFB] border rounded-[10px] text-[14px] transition-colors ${
      fieldErrors[field]
        ? "border-red-500 bg-red-50 focus:ring-red-400"
        : "border-[#E5E7EB]"
    }`;

  const renderErrors = (field) => {
    const errs = fieldErrors[field];
    if (!errs) return null;
    const list = Array.isArray(errs) ? errs : [errs];
    return (
      <div className="mt-[4px] space-y-[2px]">
        {list.map((msg, i) => (
          <p key={i} className="text-[12px] text-red-500">
            {msg}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
      <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-[17px] font-bold text-[#111827] mb-[16px]">
          {isEditing ? t("users.editUser") : t("users.addUser")}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-[12px]">
          <div className="grid grid-cols-2 gap-[10px]">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.firstName")} *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                className={inputClass("firstName")}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.lastName")} *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                className={inputClass("lastName")}
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
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className={inputClass("email")}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("users.password")}
              {!isEditing && " *"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required={!isEditing}
              className={inputClass("password")}
            />
            {renderErrors("password")}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputClass("phone")}
            />
          </div>
          {isSuperAdmin && (
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("users.role")}
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
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
