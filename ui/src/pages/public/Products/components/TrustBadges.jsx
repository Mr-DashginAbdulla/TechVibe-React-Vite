import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustBadges = () => {
  const { t } = useTranslation();

  const badges = [
    {
      icon: ShieldCheck,
      text: t("productDetails.secureCheckout"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Truck,
      text: t("productDetails.freeShipping"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: RotateCcw,
      text: t("productDetails.returnPolicy"),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-100">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${badge.bg} flex items-center justify-center`}
          >
            <badge.icon size={18} className={badge.color} />
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
