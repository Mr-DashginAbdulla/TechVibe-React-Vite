import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProfileDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, getInitials } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <Link
        to="/auth"
        className="hidden sm:flex items-center gap-[8px] px-[20px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors shadow-sm"
      >
        {t("nav.login")}
      </Link>
    );
  }

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[8px] pl-[4px] pr-[12px] py-[4px] rounded-[12px] hover:bg-accent transition-colors"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-[36px] h-[36px] rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-[36px] h-[36px] bg-linear-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-semibold border border-border">
            {getInitials()}
          </div>
        )}
        <ChevronDown className="w-[16px] h-[16px] text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-[8px] w-[200px] bg-popover rounded-[12px] shadow-lg border border-border py-[8px] z-50">
          <div className="px-[16px] py-[8px] border-b border-border">
            <p className="text-[14px] font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[12px] text-muted-foreground">{user?.email}</p>
          </div>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-foreground hover:bg-accent"
          >
            <User className="w-[16px] h-[16px]" />
            {t("profile.myProfile")}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-[10px] w-full px-[16px] py-[10px] text-[14px] text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-[16px] h-[16px]" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
