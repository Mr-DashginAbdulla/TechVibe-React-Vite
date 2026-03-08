import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

const MemoryOptionsSection = ({ memoryOptions, setMemoryOptions }) => {
  const { t } = useTranslation();

  const addMemory = () => {
    setMemoryOptions([...memoryOptions, { size: "", priceDiff: 0 }]);
  };

  const removeMemory = (index) => {
    setMemoryOptions(memoryOptions.filter((_, i) => i !== index));
  };

  const updateMemory = (index, field, value) => {
    const updated = [...memoryOptions];
    updated[index] = { ...updated[index], [field]: value };
    setMemoryOptions(updated);
  };

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <h2 className="text-[16px] font-semibold text-foreground">
          {t("products.memoryOptions")}
        </h2>
        <button
          type="button"
          onClick={addMemory}
          className="inline-flex items-center gap-[4px] text-[13px] text-primary font-medium hover:text-primary/80"
        >
          <Plus className="w-[16px] h-[16px]" />
          {t("products.addMemory")}
        </button>
      </div>
      <div className="space-y-[10px]">
        {memoryOptions.map((memory, index) => (
          <div key={index} className="flex items-center gap-[8px]">
            <input
              type="text"
              value={memory.size}
              onChange={(e) => updateMemory(index, "size", e.target.value)}
              placeholder={t("products.memorySize")}
              className="flex-1 px-[12px] py-[8px] bg-secondary border border-border rounded-[8px] text-[13px] text-foreground"
            />
            <input
              type="number"
              value={memory.priceDiff}
              onChange={(e) =>
                updateMemory(
                  index,
                  "priceDiff",
                  parseFloat(e.target.value) || 0,
                )
              }
              placeholder={t("products.priceDiff")}
              className="w-[120px] px-[12px] py-[8px] bg-secondary border border-border rounded-[8px] text-[13px] text-foreground"
            />
            <button
              type="button"
              onClick={() => removeMemory(index)}
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

export default MemoryOptionsSection;
