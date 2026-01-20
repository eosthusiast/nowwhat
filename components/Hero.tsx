
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
    // Rotate statements every 4s
    const rotateInterval = setInterval(() => {
      setStatementIndex(prev => (prev + 1) % HERO_STATEMENTS.length);
    }, 4000);

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
    <div className="flex flex-col items-center justify-center h-full text-white px-4 md:px-12 overflow-hidden">
      <div className="w-full max-w-[95vw]">
        {/* Responsive, non-wrapping container */}
        <div className="flex flex-row items-center justify-center gap-x-[2vw] whitespace-nowrap">
          
          {/* Left: Rotating Statement - Scales with screen, never wraps */}
          <div className="flex-1 text-right min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={statementIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-[clamp(1.2rem,4vw,6rem)] font-serif text-white font-light leading-none truncate"
              >
                {HERO_STATEMENTS[statementIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Static Text - Scales identically, bold and italic */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="flex-none text-[clamp(1.2rem,4vw,6rem)] font-serif font-bold italic tracking-tight text-white leading-none"
          >
            now what?
          </motion.h1>
        </div>
      </div>

      <div className="absolute bottom-12 w-full flex flex-col items-center gap-6">
        {/* Progress Bar - Only visible during the 15s wait or subtly stays */}
        <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 15, ease: "linear" }}
             className="absolute inset-y-0 left-0 bg-white"
           />
        </div>

        <div className="min-h-[64px] flex items-center justify-center">
          <AnimatePresence>
            {showContinue && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onUnlock}
                className="group flex flex-col items-center gap-2 hover:text-indigo-300 transition-colors"
              >
                <span className="text-sm tracking-widest uppercase font-sans">Continue</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-sans text-center max-w-[80vw] mt-4"
        >
          Opening doors to radical possibility for those who shape the world.
        </motion.p>
      </div>
    </div>
  );
};

export default Hero;
