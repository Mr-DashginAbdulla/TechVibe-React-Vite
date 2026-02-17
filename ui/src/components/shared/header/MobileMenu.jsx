import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import MobileUserProfile from "./mobile-menu/MobileUserProfile";
import MobileCategories from "./mobile-menu/MobileCategories";
import MobileLanguage from "./mobile-menu/MobileLanguage";
import MobileTheme from "./mobile-menu/MobileTheme";

const MobileMenu = ({ categories, onClose }) => {
  const { t } = useTranslation();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <div
      className="lg:hidden py-[16px] border-t border-border max-h-[calc(100vh-72px)] overflow-y-auto"
      style={{ overscrollBehavior: "contain", scrollBehavior: "smooth" }}
      onWheel={(e) => e.stopPropagation()}
    >
      <nav className="flex flex-col gap-[8px]">
        {/* User Profile Section */}
        {isLoggedIn && (
          <MobileUserProfile onClose={onClose} onLogout={handleLogout} />
        )}

        <Link
          to="/"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.home")}
        </Link>

        <MobileCategories categories={categories} onClose={onClose} />

        <Link
          to="/deals"
          className="px-[16px] py-[12px] text-[15px] font-medium text-foreground hover:bg-accent rounded-[8px]"
          onClick={onClose}
        >
          {t("nav.deals")}
        </Link>

        {/* Language Selection */}
        <MobileLanguage />

        {/* Theme Selection */}
        <MobileTheme />

        {!isLoggedIn && (
          <Link
            to="/auth"
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
