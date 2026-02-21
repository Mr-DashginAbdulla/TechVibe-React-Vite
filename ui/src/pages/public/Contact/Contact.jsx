import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const infoCards = [
    {
      icon: MapPin,
      label: t("storeLocation.addressLabel"),
      value: t("storeLocation.address"),
    },
    {
      icon: Phone,
      label: t("storeLocation.phoneLabel"),
      value: "+994 12 345 67 89",
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@techvibe.az",
    },
    {
      icon: Clock,
      label: t("storeLocation.workingHoursLabel"),
      value: t("storeLocation.workingHours"),
    },
  ];

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <span className="inline-block px-[14px] py-[6px] rounded-full bg-primary/10 text-primary text-[13px] font-semibold mb-[16px]">
            {t("contact.badge")}
          </span>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px] leading-tight">
            {t("contact.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[540px] mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[32px]">
          {/* Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-[20px]">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="flex items-start gap-[16px] p-[24px] rounded-[20px] bg-muted border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-[48px] h-[48px] rounded-[14px] bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-[22px] h-[22px] text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-[4px]">
                    {card.label}
                  </p>
                  <p className="text-[15px] text-foreground whitespace-pre-line">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-muted border border-border rounded-[24px] p-[40px]">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-[40px] gap-[16px]">
                  <div className="w-[72px] h-[72px] rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-[36px] h-[36px] text-green-500" />
                  </div>
                  <h2 className="text-[24px] font-bold text-foreground">
                    {t("contact.successTitle")}
                  </h2>
                  <p className="text-muted-foreground max-w-[360px]">
                    {t("contact.successDesc")}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-[8px] px-[24px] py-[12px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-[22px] font-bold text-foreground mb-[28px]">
                    {t("contact.formTitle")}
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[20px]"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[14px] font-semibold text-foreground">
                          {t("contact.name")}
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder={t("contact.namePlaceholder")}
                          className="w-full px-[16px] py-[12px] rounded-[12px] bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[14px] font-semibold text-foreground">
                          {t("contact.email")}
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder={t("contact.emailPlaceholder")}
                          className="w-full px-[16px] py-[12px] rounded-[12px] bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <label className="text-[14px] font-semibold text-foreground">
                        {t("contact.subject")}
                      </label>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        placeholder={t("contact.subjectPlaceholder")}
                        className="w-full px-[16px] py-[12px] rounded-[12px] bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <label className="text-[14px] font-semibold text-foreground">
                        {t("contact.message")}
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder={t("contact.messagePlaceholder")}
                        className="w-full px-[16px] py-[12px] rounded-[12px] bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-[10px] px-[28px] py-[14px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="w-[20px] h-[20px] border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Send className="w-[18px] h-[18px]" />
                      )}
                      {loading ? t("common.loading") : t("contact.send")}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
