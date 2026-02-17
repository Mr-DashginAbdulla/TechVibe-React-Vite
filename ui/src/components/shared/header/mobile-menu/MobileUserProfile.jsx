import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

const MobileUserProfile = ({ onClose, onLogout }) => {
  const { t } = useTranslation();
  const { user, getInitials } = useAuth();

  return (
    <div className="mx-[16px] mb-[16px] p-[16px] bg-accent/50 rounded-[16px] border border-border">
      <div className="flex items-center gap-[12px] mb-[12px]">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-[48px] h-[48px] rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-[48px] h-[48px] bg-linear-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-[18px] font-semibold border border-border">
            {getInitials()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-foreground truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[14px] text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[8px]">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center justify-center gap-[8px] px-[12px] py-[8px] bg-background text-[14px] font-medium text-foreground rounded-[8px] border border-border shadow-sm"
        >
          <User className="w-[16px] h-[16px]" />
          {t("profile.myProfile")}
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-[8px] px-[12px] py-[8px] bg-destructive/10 text-[14px] font-medium text-destructive rounded-[8px] border border-transparent hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-[16px] h-[16px]" />
          {t("nav.logout")}
        </button>
      </div>
    </div>
  );
};

export default MobileUserProfile;
