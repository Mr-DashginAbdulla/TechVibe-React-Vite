import { useTranslation } from "react-i18next";
import { Shield, Zap, Gift } from "lucide-react";

const LoginSidebar = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("auth.secureLogin"),
      description: t("auth.secureLoginDesc"),
    },
    {
      icon: Zap,
      title: t("auth.fastAccess"),
      description: t("auth.fastAccessDesc"),
    },
    {
      icon: Gift,
      title: t("auth.exclusiveRewards"),
      description: t("auth.exclusiveRewardsDesc"),
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-center w-[380px] bg-primary p-[40px] text-primary-foreground">
      <h2 className="text-[24px] font-bold mb-[24px]">
        {t("auth.welcomeBack")}
      </h2>
      <div className="space-y-[20px] mb-[32px]">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-[12px]">
            <div className="w-[40px] h-[40px] bg-white/20 rounded-[10px] flex items-center justify-center shrink-0">
              <feature.icon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <p className="font-semibold">{feature.title}</p>
              <p className="text-[13px] text-white/80">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <img
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
        alt="Shopping"
        className="w-full rounded-[16px] object-cover h-[180px]"
      />
    </div>
  );
};

export default LoginSidebar;
