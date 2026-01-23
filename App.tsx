
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import JourneySection from './components/JourneySection';
import AudioAlchemizer from './components/AudioAlchemizer';
import Descent from './components/Descent';
import { AppStage } from './types';

// DEV TOGGLE: Set to false to enable the intended gated/locked experience.
const IS_DEV_MODE = false;

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.HERO);
  
  // In Dev Mode, we pre-unlock all stages so the full flow is visible.
  const [unlockedStages, setUnlockedStages] = useState<Set<AppStage>>(
    new Set(IS_DEV_MODE ? Object.values(AppStage) : [AppStage.HERO])
  );
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Global background color logic
  const getBackgroundColor = () => {
    switch (stage) {
      case AppStage.HERO:
      case AppStage.JOURNEY:
      case AppStage.AUDIO:
        return '#050b1a'; // Deep Navy
      case AppStage.DESCENT:
        return '#f7f5f0'; // Warm Off-White (brightest white reserved for flash)
      default:
        return '#050b1a';
    }
  };

  const handleStageUnlock = (nextStage: AppStage) => {
    setUnlockedStages(prev => {
      const nextSet = new Set([...prev, nextStage]);
      // If we unlock Journey, we also unlock Audio so the user can scroll into it
      if (nextStage === AppStage.JOURNEY) {
        nextSet.add(AppStage.AUDIO);
      }
      return nextSet;
    });
    setStage(nextStage);
    
    // Explicitly remove lock before scrolling to allow movement
    document.body.classList.remove('scroll-locked');
    
    // Smooth scroll to next section
    setTimeout(() => {
      const element = document.getElementById(nextStage.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [AppStage.HERO, AppStage.JOURNEY, AppStage.AUDIO, AppStage.DESCENT];
      const viewportHeight = window.innerHeight;
      
      for (const s of sections) {
        const el = document.getElementById(s.toLowerCase());
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2) {
            setStage(s);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Precise Scroll Locking Logic
  useEffect(() => {
    const body = document.body;
    const audioEl = document.getElementById('audio');
    
    // If Dev Mode is on, we never lock the scroll.
    if (IS_DEV_MODE) {
      body.classList.remove('scroll-locked');
      return;
    }

    let shouldLock = false;

    // 1. Hero Lock: Constant until journey is unlocked
    if (stage === AppStage.HERO && !unlockedStages.has(AppStage.JOURNEY)) {
      shouldLock = true;
    }

    // 2. Audio Lock: Only lock once the user has scrolled the section fully into the viewport
    if (stage === AppStage.AUDIO && !unlockedStages.has(AppStage.DESCENT)) {
      if (audioEl) {
        const rect = audioEl.getBoundingClientRect();
        // Trigger lock when the section top is near the viewport top
        if (rect.top <= 10) {
          shouldLock = true;
          // Snap precisely to top if within range to ensure perfect alignment
          if (rect.top > 0) {
            window.scrollTo({ top: window.scrollY + rect.top, behavior: 'auto' });
          }
        }
      }
    }

    if (shouldLock) {
      body.classList.add('scroll-locked');
    } else {
      body.classList.remove('scroll-locked');
    }
  }, [stage, unlockedStages]);

  return (
    <motion.div 
      className="min-h-screen bg-transition selection:bg-purple-700/30"
      animate={{ backgroundColor: getBackgroundColor() }}
    >
      <div ref={scrollContainerRef}>
        <section id="hero" className="h-screen relative">
          <Hero onUnlock={() => handleStageUnlock(AppStage.JOURNEY)} />
        </section>

        {unlockedStages.has(AppStage.JOURNEY) && (
          <section id="journey" className="min-h-screen">
            <JourneySection />
          </section>
        )}

        {unlockedStages.has(AppStage.AUDIO) && (
          <section id="audio" className="h-screen flex items-center justify-center overflow-hidden">
            <AudioAlchemizer 
              isUnlocked={unlockedStages.has(AppStage.DESCENT)}
              onUnlock={() => handleStageUnlock(AppStage.DESCENT)} 
            />
          </section>
        )}

        <AnimatePresence>
          {unlockedStages.has(AppStage.DESCENT) && (
            <motion.section 
              id="descent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <Descent />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default App;
