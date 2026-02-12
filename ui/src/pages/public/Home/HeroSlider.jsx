import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slides = [
  {
    id: 1,
    titleKey: "heroSlider.slide1Title",
    subtitleKey: "heroSlider.slide1Subtitle",
    ctaKey: "heroSlider.slide1Cta",
    ctaLink: "/shop?category=phones",
    badgeKey: "heroSlider.slide1Badge",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    gradient: "from-violet-600/90 via-purple-600/80 to-indigo-700/90",
    darkGradient:
      "dark:from-violet-900/95 dark:via-purple-900/90 dark:to-indigo-950/95",
    accentColor: "bg-violet-500",
  },
  {
    id: 2,
    titleKey: "heroSlider.slide2Title",
    subtitleKey: "heroSlider.slide2Subtitle",
    ctaKey: "heroSlider.slide2Cta",
    ctaLink: "/shop?deals=true",
    badgeKey: "heroSlider.slide2Badge",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    gradient: "from-emerald-600/90 via-teal-600/80 to-cyan-700/90",
    darkGradient:
      "dark:from-emerald-900/95 dark:via-teal-900/90 dark:to-cyan-950/95",
    accentColor: "bg-emerald-500",
  },
  {
    id: 3,
    titleKey: "heroSlider.slide3Title",
    subtitleKey: "heroSlider.slide3Subtitle",
    ctaKey: "heroSlider.slide3Cta",
    ctaLink: "/shop?category=gaming",
    badgeKey: "heroSlider.slide3Badge",
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    gradient: "from-rose-600/90 via-red-600/80 to-orange-700/90",
    darkGradient:
      "dark:from-rose-900/95 dark:via-red-900/90 dark:to-orange-950/95",
    accentColor: "bg-rose-500",
  },
  {
    id: 4,
    titleKey: "heroSlider.slide4Title",
    subtitleKey: "heroSlider.slide4Subtitle",
    ctaKey: "heroSlider.slide4Cta",
    ctaLink: "/shop",
    badgeKey: "heroSlider.slide4Badge",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    gradient: "from-blue-600/90 via-sky-600/80 to-cyan-700/90",
    darkGradient:
      "dark:from-blue-900/95 dark:via-sky-900/90 dark:to-cyan-950/95",
    accentColor: "bg-blue-500",
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SlideContent = ({ slide, t }) => (
  <div className="relative h-full container mx-auto px-[16px] flex items-center">
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[600px] text-white"
    >
      <motion.span
        variants={itemVariants}
        className={`inline-block ${slide.accentColor} text-white text-[12px] sm:text-[13px] font-semibold px-[14px] py-[6px] rounded-full mb-[16px] uppercase tracking-wider`}
      >
        {t(slide.badgeKey)}
      </motion.span>
      <motion.h1
        variants={itemVariants}
        className="text-[32px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.1] mb-[16px] text-white drop-shadow-lg"
      >
        {t(slide.titleKey)}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-[15px] sm:text-[17px] text-white/90 mb-[28px] max-w-[480px] leading-relaxed"
      >
        {t(slide.subtitleKey)}
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link
          to={slide.ctaLink}
          className="inline-flex items-center gap-[8px] bg-white text-gray-900 font-semibold px-[28px] py-[14px] rounded-[12px] hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
        >
          {t(slide.ctaKey)}
          <ChevronRight className="w-[18px] h-[18px]" />
        </Link>
      </motion.div>
    </motion.div>
  </div>
);

const SlideNavigation = ({ slides, currentSlide, goToSlide }) => (
  <div className="absolute bottom-[20px] sm:bottom-[28px] left-1/2 -translate-x-1/2 flex items-center gap-[10px] z-10">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={`transition-all duration-300 rounded-full ${
          index === currentSlide
            ? "w-[32px] h-[10px] bg-white"
            : "w-[10px] h-[10px] bg-white/50 hover:bg-white/70"
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
);

const FeatureBar = ({ t }) => {
  const features = [
    {
      icon: Truck,
      label: t("hero.freeShipping"),
      desc: t("hero.freeShippingDesc"),
    },
    {
      icon: Shield,
      label: t("hero.securePayment"),
      desc: t("hero.securePaymentDesc"),
    },
    {
      icon: RefreshCcw,
      label: t("hero.easyReturns"),
      desc: t("hero.easyReturnsDesc"),
    },
  ];

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-[16px]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[24px] sm:gap-[48px] py-[20px]">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-[12px]">
              <div className="w-[44px] h-[44px] bg-primary/10 rounded-[12px] flex items-center justify-center">
                <f.icon className="w-[22px] h-[22px] text-primary" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  {f.label}
                </p>
                <p className="text-[12px] text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute ${direction === "left" ? "left-[12px] sm:left-[20px]" : "right-[12px] sm:right-[20px]"} top-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 z-10`}
    aria-label={`${direction === "left" ? "Previous" : "Next"} slide`}
  >
    {direction === "left" ? (
      <ChevronLeft className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-white" />
    ) : (
      <ChevronRight className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-white" />
    )}
  </button>
);

const HeroSlider = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback(
    (index) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide],
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="w-full">
      <div
        className="relative w-full h-[480px] sm:h-[520px] lg:h-[560px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-linear-to-r ${slide.gradient} ${slide.darkGradient}`}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <SlideContent slide={slide} t={t} />
          </motion.div>
        </AnimatePresence>

        <ArrowButton direction="left" onClick={prevSlide} />
        <ArrowButton direction="right" onClick={nextSlide} />
        <SlideNavigation
          slides={slides}
          currentSlide={currentSlide}
          goToSlide={goToSlide}
        />

        <div className="absolute bottom-[20px] sm:bottom-[28px] right-[20px] sm:right-[32px] z-10">
          <span className="text-white/70 text-[13px] font-medium tabular-nums">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <FeatureBar t={t} />
    </section>
  );
};

export default HeroSlider;
