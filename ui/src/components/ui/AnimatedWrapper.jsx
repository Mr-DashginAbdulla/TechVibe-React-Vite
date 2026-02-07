import { motion } from "framer-motion";

/**
 * Animation presets for consistent animations across the app
 */
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 25 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 20 },
  },
};

/**
 * AnimatedWrapper - General purpose animation wrapper component
 * @param {string} animation - Animation preset name from animationPresets
 * @param {number} delay - Animation delay in seconds
 * @param {object} custom - Custom animation overrides
 * @param {boolean} once - Animate only once (useful for scroll animations)
 * @param {string} className - Additional CSS classes
 */
const AnimatedWrapper = ({
  children,
  animation = "fadeIn",
  delay = 0,
  custom = {},
  once = false,
  className = "",
  as = "div",
  ...props
}) => {
  const preset = animationPresets[animation] || animationPresets.fadeIn;

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={custom.initial || preset.initial}
      animate={custom.animate || preset.animate}
      exit={custom.exit || preset.exit}
      transition={{
        ...preset.transition,
        delay,
        ...custom.transition,
      }}
      viewport={once ? { once: true, amount: 0.2 } : undefined}
      whileInView={once ? custom.animate || preset.animate : undefined}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * FadeIn convenience component
 */
export const FadeIn = ({ children, delay = 0, className = "", ...props }) => (
  <AnimatedWrapper
    animation="fadeIn"
    delay={delay}
    className={className}
    {...props}
  >
    {children}
  </AnimatedWrapper>
);

/**
 * FadeInUp convenience component
 */
export const FadeInUp = ({
  children,
  delay = 0,
  className = "",
  once = false,
  ...props
}) => (
  <AnimatedWrapper
    animation="fadeInUp"
    delay={delay}
    once={once}
    className={className}
    {...props}
  >
    {children}
  </AnimatedWrapper>
);

/**
 * SlideInRight convenience component
 */
export const SlideInRight = ({
  children,
  delay = 0,
  className = "",
  ...props
}) => (
  <AnimatedWrapper
    animation="slideInRight"
    delay={delay}
    className={className}
    {...props}
  >
    {children}
  </AnimatedWrapper>
);

/**
 * ScaleIn convenience component
 */
export const ScaleIn = ({ children, delay = 0, className = "", ...props }) => (
  <AnimatedWrapper
    animation="scaleIn"
    delay={delay}
    className={className}
    {...props}
  >
    {children}
  </AnimatedWrapper>
);

export default AnimatedWrapper;
