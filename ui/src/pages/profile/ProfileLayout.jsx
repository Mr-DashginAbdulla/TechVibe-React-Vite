import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { Menu, X } from "lucide-react";

const ProfileLayout = () => {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[40px] h-[40px] border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="container mx-auto px-[16px] py-[24px] lg:py-[32px]">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden flex items-center gap-[8px] mb-[16px] px-[16px] py-[10px] bg-white rounded-[12px] border border-[#E5E7EB] text-[14px] font-medium text-[#374151]"
        >
          {isSidebarOpen ? (
            <X className="w-[18px] h-[18px]" />
          ) : (
            <Menu className="w-[18px] h-[18px]" />
          )}
          {isSidebarOpen ? t("common.cancel") : t("profile.myProfile")}
        </button>

        <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[32px]">
          <div className={`${isSidebarOpen ? "block" : "hidden"} lg:block`}>
            <ProfileSidebar />
          </div>
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
