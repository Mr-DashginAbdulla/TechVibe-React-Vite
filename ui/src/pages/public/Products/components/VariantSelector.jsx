import { useTranslation } from "react-i18next";

const VariantSelector = ({ options = [], selectedOptions, onOptionSelect }) => {
  const { t } = useTranslation();

  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-5 mb-6">
      {options.map((option) => (
        <div key={option.id}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              {option.title}
            </span>
            {selectedOptions[option.id] && (
              <span className="text-sm text-muted-foreground">
                {selectedOptions[option.id].label}
              </span>
            )}
          </div>

          {option.type === "color" && (
            <div className="flex flex-wrap gap-3">
              {option.values.map((val) => (
                <button
                  key={val.label}
                  onClick={() => onOptionSelect(option.id, val)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selectedOptions[option.id]?.label === val.label
                      ? "border-primary ring-2 ring-primary/20 scale-110"
                      : "border-border hover:border-primary/50"
                  }`}
                  title={val.label}
                >
                  <span
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: val.value }}
                  />
                </button>
              ))}
            </div>
          )}

          {option.type === "select" && (
            <div className="grid grid-cols-2 gap-3">
              {option.values.map((val) => (
                <button
                  key={val.label}
                  onClick={() => onOptionSelect(option.id, val)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOptions[option.id]?.label === val.label
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <span className="block text-sm font-bold text-foreground">
                    {val.label}
                  </span>
                  {val.tag && (
                    <span className="text-xs text-muted-foreground mt-0.5 block">
                      {val.tag}
                    </span>
                  )}
                  {val.priceModifier > 0 && (
                    <span className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">
                      +${val.priceModifier}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
