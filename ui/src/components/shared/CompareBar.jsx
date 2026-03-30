import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectCompareItems, removeFromCompare, clearCompare } from "@/store/slices/compareSlice";
import { Scale, X, Trash2 } from "lucide-react";

const CompareBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector(selectCompareItems);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[800px] bg-card border border-border rounded-[16px] shadow-2xl p-[16px] flex flex-col sm:flex-row items-center justify-between gap-[16px] animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-[12px] overflow-x-auto flex-1 w-full pb-[4px] sm:pb-0 hide-scrollbar">
        <div className="flex items-center gap-[6px] shrink-0 mr-[8px]">
          <Scale className="w-[20px] h-[20px] text-primary" />
          <span className="font-semibold text-[14px]">
            {items.length} / 4
          </span>
        </div>

        {items.map((item) => (
          <div key={item.id} className="relative w-[50px] h-[50px] rounded-[8px] border border-border bg-secondary shrink-0 group">
            <button
              onClick={() => dispatch(removeFromCompare(item.id))}
              className="absolute -top-[6px] -right-[6px] w-[18px] h-[18px] bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
            >
              <X className="w-[12px] h-[12px]" />
            </button>
            <img 
              src={item.mainImage || item.image || item.images?.[0] || 'https://via.placeholder.com/50'} 
              alt={item.name} 
              className="w-full h-full object-contain p-[4px]"
            />
          </div>
        ))}
        
        {Array.from({ length: 4 - items.length }).map((_, i) => (
          <div key={`empty-${i}`} className="w-[50px] h-[50px] rounded-[8px] border border-dashed border-border bg-card flex items-center justify-center shrink-0">
            <span className="text-muted-foreground text-[18px]">+</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[12px] shrink-0 w-full sm:w-auto mt-[8px] sm:mt-0">
        <button
          onClick={() => dispatch(clearCompare())}
          className="p-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[8px] transition"
          title={t("compare.clearAll") || "Hamısını sil"}
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
        <Link
          to="/compare"
          className="flex-1 sm:flex-none px-[20px] py-[10px] bg-primary text-primary-foreground font-semibold rounded-[8px] hover:bg-primary/90 transition text-center"
        >
          {t("compare.compareNow") || "Müqayisə et"}
        </Link>
      </div>
    </div>
  );
};

export default CompareBar;
