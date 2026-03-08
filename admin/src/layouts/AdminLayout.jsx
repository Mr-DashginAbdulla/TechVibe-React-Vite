import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[260px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-[16px] sm:p-[24px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
