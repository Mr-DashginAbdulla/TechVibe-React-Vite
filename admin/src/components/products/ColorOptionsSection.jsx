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
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("products.colorOptions")}
        </h2>
        <button
          type="button"
          onClick={addColor}
          className="inline-flex items-center gap-[4px] text-[13px] text-primary font-medium hover:text-primary/80"
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
              className="w-[40px] h-[36px] rounded-[6px] border border-border cursor-pointer"
            />
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColor(index, "name", e.target.value)}
              placeholder={t("products.colorName")}
              className="flex-1 px-[12px] py-[8px] bg-secondary border border-border rounded-[8px] text-[13px] text-foreground"
            />
            <input
              type="text"
              value={color.code}
              onChange={(e) => updateColor(index, "code", e.target.value)}
              placeholder={t("products.colorCode")}
              className="w-[100px] px-[12px] py-[8px] bg-secondary border border-border rounded-[8px] text-[13px] text-foreground"
            />
            <button
              type="button"
              onClick={() => removeColor(index)}
              className="p-[6px] hover:bg-red-50 rounded-[6px]"
            >
              <X className="w-[16px] h-[16px] text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorOptionsSection;
