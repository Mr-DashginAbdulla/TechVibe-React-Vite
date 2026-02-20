import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const PersonalInfoForm = ({
  personalData,
  setPersonalData,
  isLoading,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-[20px]">
      <h2 className="text-[18px] font-semibold text-foreground mb-[20px]">
        {t("profile.personalInfo")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div>
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("auth.firstName")}
          </label>
          <input
            type="text"
            value={personalData.firstName}
            onChange={(e) =>
              setPersonalData({
                ...personalData,
                firstName: e.target.value,
              })
            }
            className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            required
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-foreground mb-[8px]">
            {t("auth.lastName")}
          </label>
          <input
            type="text"
            value={personalData.lastName}
            onChange={(e) =>
              setPersonalData({
                ...personalData,
                lastName: e.target.value,
              })
            }
            className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          Email
        </label>
        <input
          type="email"
          value={personalData.email}
          onChange={(e) =>
            setPersonalData({ ...personalData, email: e.target.value })
          }
          className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          required
        />
      </div>
      <div>
        <label className="block text-[14px] font-medium text-foreground mb-[8px]">
          {t("profile.phone")}
        </label>
        <input
          type="tel"
          value={personalData.phone}
          onChange={(e) =>
            setPersonalData({ ...personalData, phone: e.target.value })
          }
          placeholder="+994XXXXXXXXX"
          className="w-full px-[16px] py-[12px] border border-input bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-[8px] px-[24px] py-[14px] bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-semibold rounded-[12px] transition-colors"
      >
        {isLoading && <Loader2 className="w-[18px] h-[18px] animate-spin" />}
        {t("common.saveChanges")}
      </button>
    </form>
  );
};

export default PersonalInfoForm;
