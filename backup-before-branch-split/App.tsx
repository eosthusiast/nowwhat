
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import JourneySection from './components/JourneySection';
import AudioAlchemizer from './components/AudioAlchemizer';
import Descent from './components/Descent';
import FloatingBlobs from './components/FloatingBlobs';
import { AppStage } from './types';

// DEV TOGGLE: Set to false to enable the intended gated/locked experience.
const IS_DEV_MODE = false;

// Dawn gradient color keyframes
const DAWN_COLORS = {
  night: '#0a0a0f',      // Near black (Hero start)
  deepNavy: '#0d0d1a',   // Deep navy (Hero end / Journey start)
  deepPurple: '#1a0a2e', // Deep purple (Journey end)
  purple: '#2d1b4a',     // Purple (Audio start)
  dustyPurple: '#4a2a5a',// Dusty purple (Audio 25%)
  mauve: '#6b3a6b',      // Mauve (Audio end - flash starts here)
  dustyRose: '#a87e7a',  // Dusty rose (flash transition)
  preDawn: '#d4a882',    // Warm pre-dawn peach (flash transition)
  sunriseYellow: '#FFFBF5', // Very light warm sunrise cream (flash end, convergence bg)
  dawn: '#FAEADD',       // Dawn/warm tan (Descent sections)
};

// Linear interpolation between two hex colors
const lerpColor = (color1: string, color2: string, t: number): string => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.HERO);
  const [audioProgress, setAudioProgress] = useState(0); // 0-100
  const [descentProgress, setDescentProgress] = useState(0); // 0-100, tracks scroll through Descent

  // In Dev Mode, we pre-unlock all stages so the full flow is visible.
  const [unlockedStages, setUnlockedStages] = useState<Set<AppStage>>(
    new Set(IS_DEV_MODE ? Object.values(AppStage) : [AppStage.HERO])
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Global background color with gradual dawn transition
  const getBackgroundColor = () => {
    switch (stage) {
      case AppStage.HERO:
        // Subtle shift from night to deep navy during Hero
        return lerpColor(DAWN_COLORS.night, DAWN_COLORS.deepNavy, 0.3);
      case AppStage.JOURNEY:
        // Transition to deep purple during Journey
        return lerpColor(DAWN_COLORS.deepNavy, DAWN_COLORS.deepPurple, 0.7);
      case AppStage.AUDIO:
        // Gradual transition through purple → dusty purple → mauve (stops at mauve)
        const p = audioProgress / 100;
        if (p < 0.5) {
          return lerpColor(DAWN_COLORS.purple, DAWN_COLORS.dustyPurple, p * 2);
        } else {
          return lerpColor(DAWN_COLORS.dustyPurple, DAWN_COLORS.mauve, (p - 0.5) * 2);
        }
      case AppStage.DESCENT:
        return DAWN_COLORS.dawn; // Warm tan for Descent
      default:
        return DAWN_COLORS.night;
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

      // Calculate Descent scroll progress for dynamic blob colors
      const descentEl = document.getElementById('descent');
      if (descentEl) {
        const rect = descentEl.getBoundingClientRect();
        const sectionHeight = descentEl.offsetHeight;
        // Progress: 0 when section top is at viewport top, 100 when section bottom is at viewport bottom
        const scrolledIntoSection = Math.max(0, -rect.top);
        const totalScrollableHeight = sectionHeight - viewportHeight;
        if (totalScrollableHeight > 0) {
          const progress = Math.min(100, Math.max(0, (scrolledIntoSection / totalScrollableHeight) * 100));
          setDescentProgress(progress);
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
      <FloatingBlobs stage={stage} audioProgress={audioProgress} descentProgress={descentProgress} />
      <div ref={scrollContainerRef} className="relative z-10">
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
              onProgress={setAudioProgress}
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
