import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Tag } from "lucide-react";

const INITIAL_FORM = {
  code: "",
  type: "percentage",
  discount: "",
  minOrder: 0,
  maxUses: "",
  isActive: true,
  expiresAt: "",
  description: "",
};

const PromoCodeFormModal = ({ promo, onSave, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (promo) {
      setForm({
        code: promo.code || "",
        type: promo.type || "percentage",
        discount: promo.discount ?? "",
        minOrder: promo.minOrder ?? 0,
        maxUses: promo.maxUses ?? "",
        isActive: promo.isActive ?? true,
        expiresAt: promo.expiresAt
          ? new Date(promo.expiresAt).toISOString().split("T")[0]
          : "",
        description: promo.description || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [promo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discount: parseFloat(form.discount) || 0,
      minOrder: parseFloat(form.minOrder) || 0,
      maxUses: form.maxUses !== "" ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
      <div className="bg-white rounded-[20px] w-full max-w-[520px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[36px] h-[36px] bg-blue-50 rounded-[10px] flex items-center justify-center">
              <Tag className="w-[18px] h-[18px] text-[#3B82F6]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111827]">
              {promo ? t("promoCodes.editCode") : t("promoCodes.addCode")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-[8px] hover:bg-[#F3F4F6] rounded-[8px] transition-colors"
          >
            <X className="w-[20px] h-[20px] text-[#6B7280]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-[24px] space-y-[16px]">
          {/* Code */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("promoCodes.code")} *
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              placeholder="E.g. SUMMER20"
              className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>

          {/* Type + Discount */}
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("promoCodes.type")} *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="percentage">
                  {t("promoCodes.percentage")} (%)
                </option>
                <option value="fixed">{t("promoCodes.fixed")} ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("promoCodes.discount")}{" "}
                {form.type === "percentage" ? "(%)" : "($)"} *
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                required
                min="0"
                max={form.type === "percentage" ? "100" : undefined}
                step="0.01"
                placeholder={form.type === "percentage" ? "10" : "15.00"}
                className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Min Order + Max Uses */}
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("promoCodes.minOrder")} ($)
              </label>
              <input
                type="number"
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                {t("promoCodes.maxUses")}{" "}
                <span className="text-[#9CA3AF] font-normal">
                  ({t("promoCodes.optional")})
                </span>
              </label>
              <input
                type="number"
                name="maxUses"
                value={form.maxUses}
                onChange={handleChange}
                min="1"
                placeholder={t("promoCodes.unlimited")}
                className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("promoCodes.expires")}{" "}
              <span className="text-[#9CA3AF] font-normal">
                ({t("promoCodes.optional")})
              </span>
            </label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
              {t("promoCodes.description")}{" "}
              <span className="text-[#9CA3AF] font-normal">
                ({t("promoCodes.optional")})
              </span>
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("promoCodes.descriptionPlaceholder")}
              className="w-full px-[14px] py-[10px] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-[12px]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-[44px] h-[24px] bg-[#D1D5DB] peer-focus:ring-2 peer-focus:ring-[#3B82F6] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#3B82F6] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all"></div>
            </label>
            <span className="text-[14px] font-medium text-[#374151]">
              {t("promoCodes.isActive")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[10px] pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[20px] py-[10px] border border-[#E5E7EB] text-[#374151] text-[14px] font-medium rounded-[10px] hover:bg-[#F9FAFB] transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-[20px] py-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-semibold rounded-[10px] transition-colors"
            >
              {promo ? t("common.save") : t("promoCodes.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoCodeFormModal;
