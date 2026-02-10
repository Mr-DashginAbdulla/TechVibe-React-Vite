import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const SortDropdown = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "newest", label: t("shop.sortNewest") },
    { value: "price_asc", label: t("shop.sortPriceAsc") },
    { value: "price_desc", label: t("shop.sortPriceDesc") },
    { value: "rating", label: t("shop.sortRating") },
  ];

  const currentLabel =
    options.find((o) => o.value === value)?.label || options[0].label;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[8px] px-[16px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
      >
        <span>{t("shop.sortBy")}:</span>
        <span className="text-foreground">{currentLabel}</span>
        <ChevronDown
          className={`w-[16px] h-[16px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-[8px] w-[200px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] z-20">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-[16px] py-[10px] text-left text-[14px] hover:bg-accent hover:text-accent-foreground transition-colors ${
                  value === option.value
                    ? "text-primary font-medium bg-primary/10"
                    : "text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
