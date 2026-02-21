import { useTranslation } from "react-i18next";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";

const jobs = [
  {
    dept: "Engineering",
    title: "Senior React Developer",
    location: "Baku, AZ",
    type: "Full-time",
  },
  {
    dept: "Engineering",
    title: "Backend Node.js Engineer",
    location: "Baku, AZ",
    type: "Full-time",
  },
  {
    dept: "Product",
    title: "Product Manager",
    location: "Remote",
    type: "Full-time",
  },
  {
    dept: "Design",
    title: "UI/UX Designer",
    location: "Baku, AZ",
    type: "Full-time",
  },
  {
    dept: "Marketing",
    title: "Digital Marketing Specialist",
    location: "Baku, AZ",
    type: "Part-time",
  },
  {
    dept: "Operations",
    title: "Logistics Coordinator",
    location: "Baku, AZ",
    type: "Full-time",
  },
];

export default function Careers() {
  const { t } = useTranslation();
  const departments = [...new Set(jobs.map((j) => j.dept))];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden py-[80px] px-[16px] text-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto max-w-[700px] relative z-10">
          <span className="inline-block px-[14px] py-[6px] rounded-full bg-primary/10 text-primary text-[13px] font-semibold mb-[16px]">
            {t("careers.badge")}
          </span>
          <h1 className="text-[48px] font-black text-foreground mb-[20px]">
            {t("careers.title")}
          </h1>
          <p className="text-[18px] text-muted-foreground">
            {t("careers.subtitle")}
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className="py-[56px] px-[16px] bg-muted border-y border-border">
        <div className="container mx-auto max-w-[900px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
            {["perk1", "perk2", "perk3", "perk4"].map((key) => (
              <div
                key={key}
                className="text-center p-[24px] rounded-[20px] bg-background border border-border"
              >
                <p className="text-[28px] mb-[8px]">
                  {t(`careers.${key}Icon`)}
                </p>
                <p className="text-[14px] font-bold text-foreground mb-[4px]">
                  {t(`careers.${key}Title`)}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {t(`careers.${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="py-[72px] px-[16px]">
        <div className="container mx-auto max-w-[860px]">
          <h2 className="text-[30px] font-bold text-foreground mb-[40px]">
            {t("careers.openPositions")}
          </h2>
          {departments.map((dept) => (
            <div key={dept} className="mb-[40px]">
              <h3 className="text-[16px] font-bold text-muted-foreground uppercase tracking-widest mb-[16px]">
                {dept}
              </h3>
              <div className="flex flex-col gap-[12px]">
                {jobs
                  .filter((j) => j.dept === dept)
                  .map((job) => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between gap-[16px] p-[24px] rounded-[20px] bg-muted border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-[16px]">
                        <div className="w-[44px] h-[44px] rounded-[12px] bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="w-[20px] h-[20px] text-primary" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </p>
                          <div className="flex items-center gap-[16px] mt-[6px]">
                            <span className="flex items-center gap-[4px] text-[13px] text-muted-foreground">
                              <MapPin className="w-[13px] h-[13px]" />{" "}
                              {job.location}
                            </span>
                            <span className="flex items-center gap-[4px] text-[13px] text-muted-foreground">
                              <Clock className="w-[13px] h-[13px]" /> {job.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-[20px] h-[20px] text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* No Role CTA */}
          <div className="mt-[48px] p-[40px] rounded-[24px] bg-primary/5 border border-primary/20 text-center">
            <p className="text-[18px] font-bold text-foreground mb-[10px]">
              {t("careers.noRoleTitle")}
            </p>
            <p className="text-muted-foreground mb-[24px]">
              {t("careers.noRoleDesc")}
            </p>
            <a
              href="mailto:careers@techvibe.az"
              className="inline-flex items-center gap-[8px] px-[28px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("careers.sendCV")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
