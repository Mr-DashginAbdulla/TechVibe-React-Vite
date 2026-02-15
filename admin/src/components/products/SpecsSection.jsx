import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

const SpecsSection = ({ specs, setSpecs }) => {
  const { t } = useTranslation();

  const addSpec = () => {
    setSpecs({ ...specs, "": "" });
  };

  const removeSpec = (key) => {
    const updated = { ...specs };
    delete updated[key];
    setSpecs(updated);
  };

  const updateSpecKey = (oldKey, newKey) => {
    const entries = Object.entries(specs);
    const updated = {};
    entries.forEach(([k, v]) => {
      updated[k === oldKey ? newKey : k] = v;
    });
    setSpecs(updated);
  };

  const updateSpecValue = (key, value) => {
    setSpecs({ ...specs, [key]: value });
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <h2 className="text-[16px] font-semibold text-[#111827]">
          {t("products.specifications")}
        </h2>
        <button
          type="button"
          onClick={addSpec}
          className="inline-flex items-center gap-[4px] text-[13px] text-[#3B82F6] font-medium hover:text-[#2563EB]"
        >
          <Plus className="w-[16px] h-[16px]" />
          {t("productForm.addSpec")}
        </button>
      </div>
      <div className="space-y-[10px]">
        {Object.entries(specs).map(([key, value], index) => (
          <div key={index} className="flex items-center gap-[8px]">
            <input
              type="text"
              value={key}
              onChange={(e) => updateSpecKey(key, e.target.value)}
              placeholder={t("productForm.specKey")}
              className="flex-1 px-[12px] py-[8px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] text-[13px]"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateSpecValue(key, e.target.value)}
              placeholder={t("productForm.specValue")}
              className="flex-1 px-[12px] py-[8px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] text-[13px]"
            />
            <button
              type="button"
              onClick={() => removeSpec(key)}
              className="p-[6px] hover:bg-red-50 rounded-[6px]"
            >
              <X className="w-[16px] h-[16px] text-[#EF4444]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecsSection;
