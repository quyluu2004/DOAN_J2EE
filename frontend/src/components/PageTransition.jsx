import { motion } from 'framer-motion';

/**
 * Elegant Page Transition - Fade + Blur Effect
 * Inspired by React Bits Fade Content
 * 
 * Creates a smooth, luxury-feel transition with:
 * - Blur effect that clears as page enters
 * - Subtle vertical slide
 * - Elegant timing curve
 */

const pageVariants = {
    initial: {
        opacity: 0,
        filter: 'blur(10px)',
    },
    in: {
        opacity: 1,
        filter: 'blur(0px)',
    },
    out: {
        opacity: 0,
        filter: 'blur(10px)',
    },
};

const pageTransition = {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing curve
    duration: 0.6,
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
