import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { useProfileOverview } from "@/hooks/profile/useProfileOverview";
import ProfileWelcome from "./ProfileWelcome";
import ProfileStatsGrid from "./ProfileStatsGrid";
import ProfileInfoCards from "./ProfileInfoCards";
import RecentOrdersList from "./RecentOrdersList";

const ProfileOverview = () => {
  const { t } = useTranslation();
  const {
    user,
    isLoading,
    statCards,
    recentOrders,
    getStatusColor,
    getStatusText,
  } = useProfileOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-[32px] h-[32px] text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <Helmet>
        <title>{t("profile.overview")} - TechVibe</title>
      </Helmet>

      <ProfileWelcome user={user} />
      <ProfileStatsGrid statCards={statCards} />
      <ProfileInfoCards user={user} />
      <RecentOrdersList
        recentOrders={recentOrders}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </div>
  );
};

export default ProfileOverview;
