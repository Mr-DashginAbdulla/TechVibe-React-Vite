import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const StaggeredList = ({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0.1,
  once = true,
  ...props
}) => {
  const customContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      variants={customContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({
  children,
  className = "",
  customVariants = null,
  ...props
}) => {
  return (
    <motion.div
      variants={customVariants || itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredList;
