import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";

const AdminLayout = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative selection:bg-blue-500/30">
      <div
        className={`transition-all duration-500 ${!isLoggedIn ? "filter blur-sm pointer-events-none select-none brightness-75" : ""}`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-[260px]">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-[16px] sm:p-[24px]">
            {isLoggedIn ? <Outlet /> : <div className="h-[80vh]" />}
          </main>
        </div>
      </div>
      {!isLoggedIn && <LoginModal />}
    </div>
  );
};

export default AdminLayout;
