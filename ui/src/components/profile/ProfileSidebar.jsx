import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ProfileSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const menuItems = [
    {
      name: t("profile.overview"),
      href: "/profile/overview",
      icon: User,
      end: true,
    },
    { name: t("profile.myOrders"), href: "/profile/orders", icon: ShoppingBag },
    {
      name: t("profile.myAddresses"),
      href: "/profile/addresses",
      icon: MapPin,
    },
    { name: t("profile.myWishlist"), href: "/profile/wishlist", icon: Heart },
    { name: t("nav.cart"), href: "/profile/cart", icon: ShoppingCart },
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
    <aside className="w-[280px] bg-card rounded-[20px] shadow-sm border border-border p-[24px] h-fit sticky top-[96px]">
      <div className="flex items-center gap-[16px] pb-[24px] border-b border-border">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-[56px] h-[56px] rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-[56px] h-[56px] bg-linear-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-[20px] font-bold text-primary-foreground">
              {getInitials()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-foreground truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[13px] text-muted-foreground truncate">
            {user?.email}
          </p>
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
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`
            }
          >
            <item.icon className="w-[20px] h-[20px]" />
            <span className="flex-1">{item.name}</span>
            <ChevronRight className="w-[16px] h-[16px] opacity-50" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-[20px] pt-[20px] border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[12px] text-[15px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-[20px] h-[20px]" />
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
