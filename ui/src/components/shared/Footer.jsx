import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoImg from "@/assets/images/TechVibeLogo-DarkTransparent.png";

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    [t("footer.shop")]: [
      { name: t("footer.newArrivals"), href: "/products?filter=new" },
      { name: t("footer.bestSellers"), href: "/products?filter=bestsellers" },
      { name: t("footer.deals"), href: "/deals" },
      { name: t("footer.allProducts"), href: "/products" },
    ],
    [t("footer.support")]: [
      { name: t("footer.contactUs"), href: "/contact" },
      { name: t("footer.faqs"), href: "/faq" },
      { name: t("footer.shippingInfo"), href: "/shipping" },
      { name: t("footer.returns"), href: "/returns" },
    ],
    [t("footer.company")]: [
      { name: t("footer.aboutUs"), href: "/about" },
      { name: t("footer.careers"), href: "/careers" },
      { name: t("footer.press"), href: "/press" },
      { name: t("footer.blog"), href: "/blog" },
    ],
    [t("footer.legal")]: [
      { name: t("footer.privacyPolicy"), href: "/privacy" },
      { name: t("footer.termsOfService"), href: "/terms" },
      { name: t("footer.cookiePolicy"), href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay"];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="container mx-auto px-[16px] py-[60px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[40px]">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-[16px]">
              <img
                src={logoImg}
                alt="TechVibe Logo"
                className="h-[40px] w-auto"
              />
            </Link>
            <p className="text-[14px] text-[#94A3B8] leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-[15px] mb-[20px] text-white">
                {category}
              </h4>
              <ul className="space-y-[12px]">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[14px] text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1E293B]">
        <div className="container mx-auto px-[16px] py-[24px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-[20px]">
            <div className="flex items-center gap-[12px]">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[40px] h-[40px] rounded-full bg-[#1E293B] hover:bg-[#3B82F6] flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-[18px] h-[18px] text-white" />
                </a>
              ))}
            </div>

            <p className="text-[14px] text-[#64748B]">
              {t("footer.copyright")}
            </p>

            <div className="flex items-center gap-[8px]">
              <span className="text-[13px] text-[#64748B] mr-[4px]">
                {t("footer.weAccept")}:
              </span>
              <div className="flex gap-[8px]">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="px-[12px] py-[6px] bg-[#1E293B] rounded-[6px] text-[12px] font-medium text-[#94A3B8]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
