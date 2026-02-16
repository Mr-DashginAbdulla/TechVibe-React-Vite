import { MapPin, Clock, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const StoreLocation = () => {
  const { t } = useTranslation();

  return (
    <section className="py-[60px] bg-background">
      <div className="container mx-auto px-[16px]">
        <div className="text-center mb-[40px]">
          <h2 className="text-[28px] sm:text-[34px] font-bold text-foreground mb-[12px]">
            {t("storeLocation.title")}
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-[500px] mx-auto">
            {t("storeLocation.subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-stretch">
          <div className="flex-1 rounded-[20px] overflow-hidden border border-border shadow-lg min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.418881258467!2d49.8328!3d40.4093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2z28%20May%20metro%20stansiyası!5e0!3m2!1saz!2saz!4v1700000000000!5m2!1saz!2saz"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TechVibe Store Location"
            />
          </div>

          <div className="lg:w-[360px] flex flex-col gap-[24px] justify-center">
            <div className="bg-card rounded-[20px] border border-border p-[28px] shadow-sm">
              <div className="flex items-start gap-[16px] mb-[24px]">
                <div className="w-[48px] h-[48px] bg-primary/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <MapPin className="w-[24px] h-[24px] text-primary" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-foreground mb-[4px]">
                    {t("storeLocation.addressLabel")}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {t("storeLocation.address")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-[16px] mb-[24px]">
                <div className="w-[48px] h-[48px] bg-emerald-500/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <Clock className="w-[24px] h-[24px] text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-foreground mb-[4px]">
                    {t("storeLocation.workingHoursLabel")}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {t("storeLocation.workingHours")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-[16px]">
                <div className="w-[48px] h-[48px] bg-blue-500/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <Phone className="w-[24px] h-[24px] text-blue-500" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-foreground mb-[4px]">
                    {t("storeLocation.phoneLabel")}
                  </h3>
                  <p className="text-[14px] text-muted-foreground">
                    +994 12 555 55 55
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
