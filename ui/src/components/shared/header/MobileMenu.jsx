import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MobileMenu = ({ categories, onClose }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  return (
    <div
      className="lg:hidden py-[16px] border-t border-border max-h-[calc(100vh-72px)] overflow-y-auto"
      style={{ overscrollBehavior: "contain", scrollBehavior: "smooth" }}
      onWheel={(e) => e.stopPropagation()}
    >
      <nav className="flex flex-col gap-[8px]">
        <Link
          to="/"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.home")}
        </Link>

        <div>
          <button
            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            className="w-full flex items-center justify-between px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          >
            {t("nav.categories")}
            <ChevronDown
              className={`w-[18px] h-[18px] transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileCategoriesOpen && (
            <div className="ml-[16px] mt-[4px] flex flex-col gap-[4px]">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-muted-foreground hover:text-primary hover:bg-accent rounded-[8px]"
                  onClick={() => {
                    onClose();
                    setMobileCategoriesOpen(false);
                  }}
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

        <Link
          to="/deals"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.deals")}
        </Link>
        {!isLoggedIn && (
          <Link
            to="/auth/login"
            className="mx-[16px] mt-[8px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] text-center"
            onClick={onClose}
          >
            {t("nav.login")}
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
