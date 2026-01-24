import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ProfileSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const menuItems = [
    { name: t("profile.overview"), href: "/profile/overview", icon: User, end: true },
    { name: t("profile.myOrders"), href: "/profile/orders", icon: ShoppingBag },
    {
      name: t("profile.myAddresses"),
      href: "/profile/addresses",
      icon: MapPin,
    },
    { name: t("profile.myWishlist"), href: "/profile/wishlist", icon: Heart },
    {
      name: t("profile.accountSettings"),
      href: "/profile/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-[280px] bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-[24px] h-fit sticky top-[96px]">
      <div className="flex items-center gap-[16px] pb-[24px] border-b border-[#E5E7EB]">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-[56px] h-[56px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[56px] h-[56px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center">
            <span className="text-[20px] font-bold text-white">
              {getInitials()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-[#111827] truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[13px] text-[#6B7280] truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="mt-[20px] space-y-[4px]">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-[15px] font-medium transition-colors ${
                isActive
                  ? "bg-[#3B82F6] text-white"
                  : "text-[#374151] hover:bg-[#F3F4F6]"
              }`
            }
          >
            <item.icon className="w-[20px] h-[20px]" />
            <span className="flex-1">{item.name}</span>
            <ChevronRight className="w-[16px] h-[16px] opacity-50" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-[20px] pt-[20px] border-t border-[#E5E7EB]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[12px] text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[20px] h-[20px]" />
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
