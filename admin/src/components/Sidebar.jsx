import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Award,
  Settings,
  LogOut,
  Shield,
  X,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/assets/images/TechVibeLogo-LightTransparent.png";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout, isSuperAdmin } = useAuth();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: t("sidebar.dashboard") },
    { path: "/products", icon: Package, label: t("sidebar.products") },
    { path: "/categories", icon: FolderTree, label: t("sidebar.categories") },
    { path: "/orders", icon: ShoppingCart, label: t("sidebar.orders") },
    { path: "/users", icon: Users, label: t("sidebar.users") },
    { path: "/reviews", icon: Star, label: t("sidebar.reviews") },
    { path: "/brands", icon: Award, label: t("sidebar.brands") },
    { path: "/promo-codes", icon: Tag, label: t("sidebar.promoCodes") },
    { path: "/settings", icon: Settings, label: t("sidebar.settings") },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[72px] flex items-center justify-between px-[24px] border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-[10px]">
            <img src={Logo} alt="TechVibe" className="h-[40px] w-auto" />
            <div>
              <p className="text-[11px] text-muted-foreground font-medium ml-1">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-[8px] rounded-[8px] hover:bg-accent"
          >
            <X className="w-[20px] h-[20px] text-muted-foreground" />
          </button>
        </div>

        <div className="p-[16px] border-b border-sidebar-border">
          <div className="flex items-center gap-[12px] p-[12px] bg-secondary rounded-[12px]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-linear-to-br from-primary to-ring rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-[4px]">
                <Shield
                  className={`w-[12px] h-[12px] ${isSuperAdmin ? "text-amber-500" : "text-primary"}`}
                />
                <span className="text-[12px] text-muted-foreground">
                  {isSuperAdmin ? t("users.superAdmin") : t("users.admin")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-[16px] flex flex-col gap-[4px]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[10px] transition-all ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-[20px] h-[20px]" />
              <span className="text-[14px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-[16px] border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center gap-[12px] w-full px-[16px] py-[12px] text-destructive hover:bg-destructive/10 rounded-[10px] transition-colors"
          >
            <LogOut className="w-[20px] h-[20px]" />
            <span className="text-[14px] font-medium">
              {t("sidebar.logout")}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
