import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { X } from "lucide-react";

const ActiveFilters = ({ filters, categories, onRemove }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const tags = [];

  if (filters.search) {
    tags.push({
      type: "search",
      value: filters.search,
      label: `"${filters.search}"`,
    });
  }

  filters.categories?.forEach((catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) tags.push({ type: "category", value: catId, label: cat.name });
  });

  filters.brands?.forEach((brand) => {
    tags.push({ type: "brand", value: brand, label: brand });
  });

  if (filters.minPrice) {
    tags.push({
      type: "minPrice",
      value: filters.minPrice,
      label: `Min: ${formatPrice(filters.minPrice)}`,
    });
  }

  if (filters.maxPrice) {
    tags.push({
      type: "maxPrice",
      value: filters.maxPrice,
      label: `Max: ${formatPrice(filters.maxPrice)}`,
    });
  }

  if (filters.minRating) {
    tags.push({
      type: "minRating",
      value: filters.minRating,
      label: `${filters.minRating}+ ⭐`,
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[8px] mb-[20px]">
      {tags.map((tag, idx) => (
        <span
          key={`${tag.type}-${idx}`}
          className="inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-primary/10 text-primary rounded-full text-[13px] font-medium"
        >
          {tag.label}
          <button
            onClick={() => onRemove(tag.type, tag.value)}
            className="hover:bg-primary/20 rounded-full p-[2px] transition-colors"
          >
            <X className="w-[14px] h-[14px]" />
          </button>
        </span>
      ))}
    </div>
  );
};

export default ActiveFilters;
