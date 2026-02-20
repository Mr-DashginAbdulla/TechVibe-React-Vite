import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Calendar, Shield } from "lucide-react";

const ProfileInfoCards = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="text-[18px] font-semibold text-foreground">
            {t("profile.personalInfo")}
          </h2>
          <Link
            to="/profile/settings"
            className="text-[14px] text-primary hover:underline"
          >
            {t("common.edit")}
          </Link>
        </div>
        <div className="space-y-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
              <Mail className="w-[18px] h-[18px] text-muted-foreground" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">
                {t("auth.email")}
              </p>
              <p className="text-[15px] font-medium text-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
              <Phone className="w-[18px] h-[18px] text-muted-foreground" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">
                {t("profile.phone")}
              </p>
              <p className="text-[15px] font-medium text-foreground">
                {user?.phone || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
        <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
          {t("profile.accountSettings")}
        </h2>
        <div className="space-y-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
              <Calendar className="w-[18px] h-[18px] text-muted-foreground" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">
                {t("profile.memberSince")}
              </p>
              <p className="text-[15px] font-medium text-foreground">
                {user?.memberSince ||
                  new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-muted/50 rounded-[10px] flex items-center justify-center">
              <Shield className="w-[18px] h-[18px] text-muted-foreground" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">
                {t("order.status")}
              </p>
              <span
                className={`inline-flex px-[10px] py-[4px] rounded-full text-[12px] font-medium ${
                  user?.isVerified
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {user?.isVerified ? "✓" : "!"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCards;
