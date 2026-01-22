
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JOURNEY_STOPS } from '../constants';
import { Compass, Sparkles, Users, Globe } from 'lucide-react';

const ICON_MAP = {
  top: Compass,
  right: Sparkles,
  bottom: Users,
  left: Globe
};

// Order for sequential animation: top, right, bottom, left
const POSITION_ORDER = ['top', 'right', 'bottom', 'left'];
const AUTO_ANIMATION_INTERVAL = 4000; // 4 seconds per corner

const INITIAL_DELAY = 3000; // 3 seconds delay before starting auto-animation

const EnsoCircle: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number | null>(null);
  const [autoActiveIndex, setAutoActiveIndex] = useState<number>(-1); // Start at -1 (nothing shown)
  const [isHovering, setIsHovering] = useState(false);
  const [hasStartedAuto, setHasStartedAuto] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial delay before starting auto-animation
  useEffect(() => {
    delayTimeoutRef.current = setTimeout(() => {
      setHasStartedAuto(true);
      setAutoActiveIndex(0); // Start with first position (top)
    }, INITIAL_DELAY);

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);

  // Auto-animation effect (only runs after initial delay)
  useEffect(() => {
    if (!hasStartedAuto) return;

    // Start auto-animation when not hovering
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setAutoActiveIndex((prev) => (prev + 1) % POSITION_ORDER.length);
      }, AUTO_ANIMATION_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, hasStartedAuto]);

  // Get the index of a stop based on its position in the auto-animation order
  const getStopIndexByPosition = (position: string): number => {
    return JOURNEY_STOPS.findIndex(stop => stop.position === position);
  };

  // Determine which stop should be active (hover takes priority over auto)
  const currentActiveStop = isHovering
    ? activeStop
    : (autoActiveIndex >= 0 ? getStopIndexByPosition(POSITION_ORDER[autoActiveIndex]) : null);

  const handleMouseEnter = (idx: number) => {
    setIsHovering(true);
    setActiveStop(idx);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setActiveStop(null);
  };

  const getPositionStyles = (pos: string) => {
    switch (pos) {
      case 'top': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'right': return 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
      case 'left': return 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return '';
    }
  };

  return (
    <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] flex items-center justify-center">
      {/* Hand-drawn Enso SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full text-indigo-400/20 drop-shadow-2xl"
        style={{ filter: 'url(#enso-texture)' }}
      >
        <defs>
          <filter id="enso-texture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        
        {/* Organic, imperfect circle path mimicking a single brush stroke */}
        <motion.path
          d="M 50,15 
             C 70,15 85,30 85,50 
             C 85,70 70,85 50,85 
             C 30,85 15,70 15,50 
             C 15,32 28,18 45,15.5 
             L 48,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="280"
          initial={{ strokeDashoffset: 280, opacity: 0 }}
          whileInView={{ strokeDashoffset: 0, opacity: 1 }}
          transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
        />
        
        {/* Faint inner ring for subtle depth */}
        <motion.circle
          cx="50" cy="50" r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
          strokeDasharray="2,4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          transition={{ delay: 2, duration: 2 }}
        />
      </svg>

      {/* Center Content */}
      <div className="relative z-10 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="space-y-0"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-light text-white leading-none tracking-wide">
            Two Weeks<br />
            <span className="font-bold text-[0.7em]">30 People</span>
          </h2>
        </motion.div>
      </div>

      {/* Interactive Points - Styled as subtle 'marks' */}
      <div className="absolute inset-[15%] pointer-events-none">
        {JOURNEY_STOPS.map((stop, idx) => {
          const Icon = ICON_MAP[stop.position as keyof typeof ICON_MAP];
          const isActive = currentActiveStop === idx;
          return (
            <div
              key={idx}
              className={`absolute ${getPositionStyles(stop.position)} pointer-events-auto group`}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                animate={isActive ? {
                  scale: 1.15,
                  boxShadow: '0 0 20px rgba(129, 140, 248, 0.6), 0 0 40px rgba(129, 140, 248, 0.3)'
                } : {
                  scale: 1,
                  boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 md:w-12 md:h-12 bg-indigo-950/40 backdrop-blur-md border rounded-full flex items-center justify-center cursor-help transition-colors duration-500 ${
                  isActive
                    ? 'border-indigo-400/60 text-indigo-200'
                    : 'border-indigo-500/20 text-indigo-300/60 group-hover:text-indigo-200 group-hover:border-indigo-400/40'
                }`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </motion.div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    className="absolute z-30 w-44 md:w-52 p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-lg pointer-events-none overflow-hidden"
                    style={{
                      top: stop.position === 'bottom' ? '60px' : 'auto',
                      bottom: stop.position === 'top' ? '60px' : 'auto',
                      left: stop.position === 'right' ? '60px' : (stop.position === 'top' || stop.position === 'bottom' ? '50%' : 'auto'),
                      right: stop.position === 'left' ? '60px' : 'auto',
                      transform: (stop.position === 'top' || stop.position === 'bottom') ? 'translateX(-50%)' : 'none'
                    }}
                  >
                    {/* Decorative mark */}
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl" />

                    <h4 className="font-serif text-sm font-bold text-white mb-1.5 tracking-tight">{stop.title}</h4>
                    <p className="text-[10px] text-indigo-100/70 leading-relaxed font-sans font-light">{stop.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnsoCircle;
