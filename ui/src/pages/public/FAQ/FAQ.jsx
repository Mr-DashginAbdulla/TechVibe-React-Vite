import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-[16px] overflow-hidden bg-muted transition-all duration-200">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-[24px] py-[20px] text-left group"
      >
        <span className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors pr-[16px]">
          {question}
        </span>
        <ChevronDown
          className={`w-[20px] h-[20px] text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-[24px] pb-[20px] text-[15px] text-muted-foreground leading-relaxed border-t border-border pt-[16px]">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  const categories = [
    {
      key: "shipping",
      label: t("faq.catShipping"),
      items: [
        { q: t("faq.q_ship1"), a: t("faq.a_ship1") },
        { q: t("faq.q_ship2"), a: t("faq.a_ship2") },
        { q: t("faq.q_ship3"), a: t("faq.a_ship3") },
      ],
    },
    {
      key: "returns",
      label: t("faq.catReturns"),
      items: [
        { q: t("faq.q_ret1"), a: t("faq.a_ret1") },
        { q: t("faq.q_ret2"), a: t("faq.a_ret2") },
        { q: t("faq.q_ret3"), a: t("faq.a_ret3") },
      ],
    },
    {
      key: "payment",
      label: t("faq.catPayment"),
      items: [
        { q: t("faq.q_pay1"), a: t("faq.a_pay1") },
        { q: t("faq.q_pay2"), a: t("faq.a_pay2") },
        { q: t("faq.q_pay3"), a: t("faq.a_pay3") },
      ],
    },
    {
      key: "orders",
      label: t("faq.catOrders"),
      items: [
        { q: t("faq.q_ord1"), a: t("faq.a_ord1") },
        { q: t("faq.q_ord2"), a: t("faq.a_ord2") },
        { q: t("faq.q_ord3"), a: t("faq.a_ord3") },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-[60px] px-[16px]">
      <div className="container mx-auto max-w-[860px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <div className="w-[64px] h-[64px] rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-[20px]">
            <HelpCircle className="w-[30px] h-[30px] text-primary" />
          </div>
          <h1 className="text-[42px] font-bold text-foreground mb-[16px]">
            {t("faq.title")}
          </h1>
          <p className="text-[17px] text-muted-foreground">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-[48px]">
          {categories.map((cat) => (
            <div key={cat.key}>
              <h2 className="text-[20px] font-bold text-foreground mb-[20px] flex items-center gap-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-primary inline-block" />
                {cat.label}
              </h2>
              <div className="flex flex-col gap-[12px]">
                {cat.items.map((item) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-[64px] text-center p-[40px] rounded-[24px] bg-primary/5 border border-primary/20">
          <h3 className="text-[22px] font-bold text-foreground mb-[12px]">
            {t("faq.stillQuestions")}
          </h3>
          <p className="text-muted-foreground mb-[24px]">
            {t("faq.stillQuestionsDesc")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-[8px] px-[28px] py-[13px] rounded-[12px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("footer.contactUs")}
          </Link>
        </div>
      </div>
    </div>
  );
}
