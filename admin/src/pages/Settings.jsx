import { useState } from "react";
import { Save, Store, User, Bell, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";

const Settings = () => {
  const { user, isSuperAdmin } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(user.id, profileData);
      toast.success("Profil məlumatları yeniləndi");
    } catch (error) {
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Şifrələr uyğun gəlmir");
      return;
    }
    setSaving(true);
    try {
      await userService.update(user.id, { password: passwordData.newPassword });
      toast.success("Şifrə yeniləndi");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Təhlükəsizlik", icon: Shield },
  ];

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#111827]">Tənzimləmələr</h1>
        <p className="text-[14px] text-[#6B7280] mt-[4px]">
          Hesab və sistem tənzimləmələri
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[24px]">
        {/* Sidebar Tabs */}
        <div className="lg:w-[240px]">
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[8px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[10px] text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-[#3B82F6] text-white"
                    : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <tab.icon className="w-[20px] h-[20px]" />
                <span className="text-[14px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Admin Info Card */}
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-[16px] p-[20px] mt-[16px]">
            <div className="flex items-center gap-[12px]">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-[48px] h-[48px] rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-[48px] h-[48px] bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-[18px]">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-[16px] font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[13px] text-white/80">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
              <h2 className="text-[18px] font-semibold text-[#111827] mb-[24px]">
                Profil Məlumatları
              </h2>
              <form onSubmit={handleProfileSave} className="space-y-[20px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div className="flex justify-end pt-[8px]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] disabled:opacity-50"
                  >
                    <Save className="w-[18px] h-[18px]" />
                    {saving ? "Saxlanılır..." : "Saxla"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
              <h2 className="text-[18px] font-semibold text-[#111827] mb-[24px]">
                Şifrəni Dəyiş
              </h2>
              <form
                onSubmit={handlePasswordSave}
                className="space-y-[20px] max-w-[400px]"
              >
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    Cari Şifrə
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    Yeni Şifrə
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                    Yeni Şifrəni Təsdiqlə
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div className="flex justify-end pt-[8px]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-[8px] px-[24px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] disabled:opacity-50"
                  >
                    <Shield className="w-[18px] h-[18px]" />
                    {saving ? "Dəyişdirilir..." : "Şifrəni Dəyiş"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
