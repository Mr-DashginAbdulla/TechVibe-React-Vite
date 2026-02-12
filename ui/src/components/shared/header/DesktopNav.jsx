import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DesktopNav = ({ categories }) => {
  const { t } = useTranslation();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);

  return (
    <nav className="hidden lg:flex items-center gap-[32px]">
      <Link
        to="/"
        className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        {t("nav.home")}
      </Link>

      <div
        ref={categoriesRef}
        className="relative"
        onMouseEnter={() => {
          if (window.categoriesTimeout) {
            clearTimeout(window.categoriesTimeout);
          }
          setCategoriesOpen(true);
        }}
        onMouseLeave={() => {
          window.categoriesTimeout = setTimeout(() => {
            setCategoriesOpen(false);
          }, 200);
        }}
      >
        <button className="flex items-center gap-[4px] text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors">
          {t("nav.categories")}
          <ChevronDown
            className={`w-[14px] h-[14px] transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {categoriesOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-full pt-[12px]"
            >
              <div className="bg-popover rounded-[16px] shadow-xl border border-border p-[24px] min-w-[600px]">
                <div className="grid grid-cols-4 gap-[32px]">
                  {categories
                    .filter((cat) => cat.parentId === null)
                    .map((parent) => {
                      const children = categories.filter(
                        (cat) => cat.parentId === parent.id,
                      );
                      return (
                        <div key={parent.id}>
                          <Link
                            to={`/shop?category=${parent.id}`}
                            className="text-[15px] font-semibold text-foreground hover:text-primary mb-[12px] block"
                            onClick={() => setCategoriesOpen(false)}
                          >
                            {t(`categories.${parent.id}`)}
                          </Link>
                          <ul className="space-y-[8px]">
                            {children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  to={`/shop?category=${child.id}`}
                                  className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
                                  onClick={() => setCategoriesOpen(false)}
                                >
                                  {t(`categories.${child.id}`)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-[20px] pt-[16px] border-t border-border">
                  <Link
                    to="/shop"
                    className="flex items-center justify-center gap-[8px] text-[14px] font-medium text-primary hover:text-primary/80"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {t("home.viewAll")}
                    <ArrowRight className="w-[16px] h-[16px]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link
        to="/deals"
        className="text-[15px] font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        {t("nav.deals")}
      </Link>
    </nav>
  );
};

export default DesktopNav;
