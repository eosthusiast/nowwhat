
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_STATEMENTS } from '../constants';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onUnlock: () => void;
}

const Hero: React.FC<HeroProps> = ({ onUnlock }) => {
  const [statementIndex, setStatementIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Rotate statements every ~3.9s (1.5x faster)
    const rotateInterval = setInterval(() => {
      setStatementIndex(prev => (prev + 1) % HERO_STATEMENTS.length);
    }, 3867);

    // Show continue button after 15s
    const unlockTimer = setTimeout(() => {
      setShowContinue(true);
    }, 15000);

    return () => {
      clearInterval(rotateInterval);
      clearTimeout(unlockTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-white px-6 md:px-12">
      <div className="w-full max-w-[90vw] md:max-w-[95vw] mb-[15vh] md:mb-0">
        {/* Responsive, centered vertical layout */}
        <div className="flex flex-col items-center justify-center gap-y-4">

          {/* Top: Rotating Statement - Centered with fixed height to prevent jumping */}
          <div className="text-center min-h-[4rem] md:min-h-[5rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={statementIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-[clamp(1.5rem,5vw,7rem)] font-serif text-white font-light leading-tight"
              >
                {HERO_STATEMENTS[statementIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom: Static Text - Centered below rotator */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-[clamp(2rem,6.5vw,9rem)] font-serif font-bold italic tracking-tight text-purple-500 leading-relaxed"
          >
            now what?
          </motion.h1>
        </div>
      </div>

      <div className="absolute bottom-24 md:bottom-12 w-full flex flex-col items-center gap-2 md:gap-6 px-6">
        {/* Progress Bar - Only visible during the 15s wait or subtly stays */}
        <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
           <motion.div
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 15, ease: "linear" }}
             className="absolute inset-y-0 left-0 bg-white"
           />
        </div>

        <div className="min-h-[56px] md:min-h-[64px] flex items-center justify-center">
          <AnimatePresence>
            {showContinue && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onUnlock}
                className="group flex flex-col items-center gap-1 md:gap-2 hover:text-purple-500 transition-colors"
              >
                <span className="text-sm md:text-sm tracking-widest uppercase font-sans">Continue</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-[clamp(10px,2.5vw,14px)] tracking-[0.12em] md:tracking-[0.2em] uppercase font-sans text-center w-full"
        >
          Opening doors to radical possibility for those who shape the world.
        </motion.p>
      </div>
    </div>
  );
};

export default Hero;
