export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

export const scaleOnHover = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } }
};

export const glowOnHover = {
  whileHover: {
    boxShadow: '0 0 25px rgba(183, 110, 121, 0.3)',
    transition: { duration: 0.2 }
  }
};

export const slideInLeft = {
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } }
};

export const slideInRight = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } }
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -6,
    transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
  }
};
