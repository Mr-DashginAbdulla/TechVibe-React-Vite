import { useTranslation } from "react-i18next";
import { Camera, Loader2 } from "lucide-react";

const SettingsHeader = ({ user, fileInputRef, isLoading, onAvatarChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[24px]">
      <div className="flex items-center gap-[20px]">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-[80px] h-[80px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[80px] h-[80px] bg-linear-to-br from-primary to-gradient-to rounded-full flex items-center justify-center">
              <span className="text-[28px] font-bold text-primary-foreground">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-[16px] h-[16px] animate-spin" />
            ) : (
              <Camera className="w-[16px] h-[16px]" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-foreground">
            {t("profile.accountSettings")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {t("profile.personalInfo")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
