import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

const ColorOptionsSection = ({ colors, setColors }) => {
  const { t } = useTranslation();

  const addColor = () => {
    setColors([...colors, { name: "", code: "#000000" }]);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index, field, value) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    setColors(updated);
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <h2 className="text-[16px] font-semibold text-[#111827]">
          {t("products.colorOptions")}
        </h2>
        <button
          type="button"
          onClick={addColor}
          className="inline-flex items-center gap-[4px] text-[13px] text-[#3B82F6] font-medium hover:text-[#2563EB]"
        >
          <Plus className="w-[16px] h-[16px]" />
          {t("products.addColor")}
        </button>
      </div>
      <div className="space-y-[10px]">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-[8px]">
            <input
              type="color"
              value={color.code}
              onChange={(e) => updateColor(index, "code", e.target.value)}
              className="w-[40px] h-[36px] rounded-[6px] border border-[#E5E7EB] cursor-pointer"
            />
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColor(index, "name", e.target.value)}
              placeholder={t("products.colorName")}
              className="flex-1 px-[12px] py-[8px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] text-[13px]"
            />
            <input
              type="text"
              value={color.code}
              onChange={(e) => updateColor(index, "code", e.target.value)}
              placeholder={t("products.colorCode")}
              className="w-[100px] px-[12px] py-[8px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] text-[13px]"
            />
            <button
              type="button"
              onClick={() => removeColor(index)}
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

export default ColorOptionsSection;
