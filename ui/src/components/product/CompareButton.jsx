import { Scale } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { addToCompare, removeFromCompare, selectCompareItems } from "@/store/slices/compareSlice";
import { toast } from "react-toastify";

const CompareButton = ({ product, className = "" }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const compareItems = useSelector(selectCompareItems);

  const isCompared = compareItems.some((item) => item.id === product?.id);

  const handleCompare = (e) => {
    e.preventDefault();
    if (!product) return;

    if (isCompared) {
      dispatch(removeFromCompare(product.id));
    } else {
      if (compareItems.length >= 4) {
        toast.warning(t("compare.limitReached") || "Maksimum 4 məhsul müqayisə edilə bilər");
        return;
      }
      dispatch(addToCompare(product));
    }
  };

  return (
    <button
      onClick={handleCompare}
      className={`absolute top-[56px] right-[12px] z-10 w-[36px] h-[36px] bg-card rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${
        isCompared ? "text-primary" : "text-muted-foreground hover:text-primary"
      } ${className}`}
      title={isCompared ? (t("compare.remove") || "Müqayisədən çıxar") : (t("compare.add") || "Müqayisəyə əlavə et")}
    >
      <Scale className="w-[18px] h-[18px]" />
    </button>
  );
};

export default CompareButton;
