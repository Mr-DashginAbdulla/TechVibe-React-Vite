import { useTranslation } from "react-i18next";

const VariantSelector = ({ options = [], selectedOptions, onOptionSelect }) => {
  const { t } = useTranslation();

  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-5 mb-6">
      {options.map((option) => (
        <div key={option.id}>
          {/* Option Title */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">
              {option.title}
            </span>
            {selectedOptions[option.id] && (
              <span className="text-sm text-gray-500">
                {selectedOptions[option.id].label}
              </span>
            )}
          </div>

          {/* Color Selector */}
          {option.type === "color" && (
            <div className="flex flex-wrap gap-3">
              {option.values.map((val) => (
                <button
                  key={val.label}
                  onClick={() => onOptionSelect(option.id, val)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selectedOptions[option.id]?.label === val.label
                      ? "border-blue-500 ring-2 ring-blue-100 scale-110"
                      : "border-gray-200 hover:border-gray-300"
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

          {/* Storage/Select Selector */}
          {option.type === "select" && (
            <div className="grid grid-cols-2 gap-3">
              {option.values.map((val) => (
                <button
                  key={val.label}
                  onClick={() => onOptionSelect(option.id, val)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOptions[option.id]?.label === val.label
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="block text-sm font-bold text-gray-900">
                    {val.label}
                  </span>
                  {val.tag && (
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      {val.tag}
                    </span>
                  )}
                  {val.priceModifier > 0 && (
                    <span className="absolute top-4 right-4 text-xs font-medium text-gray-500">
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
