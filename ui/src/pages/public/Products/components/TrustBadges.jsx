import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustBadges = () => {
  const { t } = useTranslation();

  const badges = [
    {
      icon: ShieldCheck,
      text: t("productDetails.secureCheckout"),
      color: "text-success",
      bg: "bg-success",
    },
    {
      icon: Truck,
      text: t("productDetails.freeShipping"),
      color: "text-primary",
      bg: "bg-primary",
    },
    {
      icon: RotateCcw,
      text: t("productDetails.returnPolicy"),
      color: "text-primary",
      bg: "bg-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-border">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${badge.bg}/10 flex items-center justify-center`}
          >
            <badge.icon size={18} className={badge.color} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
