import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Settings,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout, isSuperAdmin } = useAuth();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Məhsullar" },
    { path: "/categories", icon: FolderTree, label: "Kateqoriyalar" },
    { path: "/orders", icon: ShoppingCart, label: "Sifarişlər" },
    { path: "/users", icon: Users, label: "İstifadəçilər" },
    { path: "/reviews", icon: Star, label: "Rəylər" },
    { path: "/settings", icon: Settings, label: "Tənzimləmələr" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-[#E5E7EB] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center justify-between px-[24px] border-b border-[#E5E7EB]">
          <Link to="/" className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-[10px] flex items-center justify-center">
              <span className="text-white font-bold text-[18px]">T</span>
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#111827]">TechVibe</h1>
              <p className="text-[11px] text-[#6B7280]">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-[8px] rounded-[8px] hover:bg-[#F3F4F6]"
          >
            <X className="w-[20px] h-[20px] text-[#6B7280]" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-[16px] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-[12px] p-[12px] bg-[#F9FAFB] rounded-[12px]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#111827] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-[4px]">
                <Shield
                  className={`w-[12px] h-[12px] ${isSuperAdmin ? "text-amber-500" : "text-[#3B82F6]"}`}
                />
                <span className="text-[12px] text-[#6B7280]">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-[16px] flex flex-col gap-[4px]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[10px] transition-all ${
                isActive(item.path)
                  ? "bg-[#3B82F6] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <item.icon className="w-[20px] h-[20px]" />
              <span className="text-[14px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-[16px] border-t border-[#E5E7EB]">
          <button
            onClick={logout}
            className="flex items-center gap-[12px] w-full px-[16px] py-[12px] text-[#EF4444] hover:bg-red-50 rounded-[10px] transition-colors"
          >
            <LogOut className="w-[20px] h-[20px]" />
            <span className="text-[14px] font-medium">Çıxış</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
