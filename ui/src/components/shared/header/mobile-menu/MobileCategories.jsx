import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileCategories = ({ categories, onClose }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
      >
        {t("nav.categories")}
        <ChevronDown
          className={`w-[18px] h-[18px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="ml-[16px] mt-[4px] flex flex-col gap-[4px]">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-muted-foreground hover:text-primary hover:bg-accent rounded-[8px]"
              onClick={onClose}
            >
              <img
                src={category.image}
                alt=""
                className="w-[32px] h-[32px] rounded-[6px] object-cover"
              />
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCategories;
