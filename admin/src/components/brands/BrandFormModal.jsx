import { ToggleLeft, ToggleRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">
      {label}
    </label>
    {children}
  </div>
);

const BrandFormModal = ({ form, setForm, onSubmit, onClose, isEditing }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
      <div className="bg-white rounded-[20px] w-full max-w-[480px] shadow-2xl">
        <div className="px-[24px] py-[20px] border-b border-[#E5E7EB]">
          <h2 className="text-[18px] font-bold text-[#111827]">
            {isEditing ? t("brands.editBrand") : t("brands.addBrand")}
          </h2>
        </div>
        <form onSubmit={onSubmit} className="p-[24px]">
          <div className="space-y-[16px]">
            <FormField label={`${t("brands.brandName")} *`}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                placeholder="Apple"
                required
              />
            </FormField>
            <FormField label={`${t("brands.logoUrl")} (Light Mode) *`}>
              <input
                type="url"
                value={form.logo.light}
                onChange={(e) =>
                  setForm({
                    ...form,
                    logo: { ...form.logo, light: e.target.value },
                  })
                }
                className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                placeholder="https://logo.clearbit.com/apple.com"
                required
              />
              {form.logo.light && (
                <div className="mt-[8px] flex items-center gap-[8px]">
                  <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-[8px] flex items-center justify-center">
                    <img
                      src={form.logo.light}
                      alt="Preview Light"
                      className="w-[28px] h-[28px] object-contain"
                    />
                  </div>
                  <span className="text-[12px] text-[#6B7280]">
                    {t("brands.preview")} (Light)
                  </span>
                </div>
              )}
            </FormField>
            <FormField label={`${t("brands.logoUrl")} (Dark Mode) *`}>
              <input
                type="url"
                value={form.logo.dark}
                onChange={(e) =>
                  setForm({
                    ...form,
                    logo: { ...form.logo, dark: e.target.value },
                  })
                }
                className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                placeholder="https://cdn.simpleicons.org/apple/white"
                required
              />
              {form.logo.dark && (
                <div className="mt-[8px] flex items-center gap-[8px]">
                  <div className="w-[40px] h-[40px] bg-[#1F2937] rounded-[8px] flex items-center justify-center">
                    <img
                      src={form.logo.dark}
                      alt="Preview Dark"
                      className="w-[28px] h-[28px] object-contain"
                    />
                  </div>
                  <span className="text-[12px] text-[#6B7280]">
                    {t("brands.preview")} (Dark)
                  </span>
                </div>
              )}
            </FormField>
            <FormField label={t("brands.website")}>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                placeholder="https://www.apple.com"
              />
            </FormField>
            <div className="flex items-center gap-[10px]">
              <label className="text-[13px] font-semibold text-[#374151]">
                {t("common.active")}
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
              >
                {form.isActive ? (
                  <ToggleRight className="w-[28px] h-[28px] text-[#10B981]" />
                ) : (
                  <ToggleLeft className="w-[28px] h-[28px] text-[#9CA3AF]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-[12px] mt-[24px] pt-[16px] border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-[20px] py-[10px] text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-[20px] py-[10px] bg-[#3B82F6] text-white text-[14px] font-medium rounded-[10px] hover:bg-[#2563EB] transition-colors"
            >
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandFormModal;
