import { useTranslation } from "react-i18next";
import { User, Shield } from "lucide-react";

const SettingsSidebar = ({ activeTab, setActiveTab, user, isSuperAdmin }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "security", label: t("settings.security"), icon: Shield },
  ];

  return (
    <div className="lg:w-[240px]">
      <div className="bg-card rounded-[16px] border border-border p-[8px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-[12px] w-full px-[16px] py-[12px] rounded-[10px] text-left transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <tab.icon className="w-[20px] h-[20px]" />
            <span className="text-[14px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-linear-to-br from-primary to-ring rounded-[16px] p-[20px] mt-[16px]">
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
              {isSuperAdmin ? t("users.superAdmin") : t("users.admin")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
