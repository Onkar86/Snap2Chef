import React from 'react';
// FIX: Import `Variants` type from framer-motion
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Camera, UtensilsCrossed } from 'lucide-react';

const messages = [
  "Prepping the ingredients...",
  "Consulting with our AI chef...",
  "Simmering the details...",
  "Plating your results...",
  "Adding a pinch of magic...",
  "Almost ready to serve!"
];

const Loading: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const iconVariants: Variants = {
      initial: {
        opacity: 0,
        scale: 0.3,
        rotate: -180,
        filter: "blur(6px) brightness(0.5)",
      },
      animate: {
        opacity: 1,
        scale: [0.8, 1.1, 1], // bounce effect
        rotate: 0,
        filter: "blur(0px) brightness(1)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 1.2,
          delay: 0.2,
        },
      },
      pulse: {
        scale: [1, 1.05, 1], // subtle breathing animation
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
      exit: {
        opacity: 0,
        scale: 0.4,
        rotate: 180,
        filter: "blur(4px) brightness(0.8)",
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      },
    };

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <div className="relative w-24 h-24">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key="camera"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={iconVariants}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        }}
                    >
                        <Camera className="w-20 h-20 text-emerald-500" />
                    </motion.div>
                </AnimatePresence>
                
                 <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.5,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        duration: 2,
                        ease: 'easeInOut'
                    }}
                >
                     <UtensilsCrossed className="w-16 h-16 text-emerald-500 opacity-60" />
                </motion.div>
            </div>
            
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-8">Cooking up your results...</h2>
             <AnimatePresence mode="wait">
                <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-slate-500 dark:text-slate-400 mt-2"
                >
                    {message}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

export default Loading;