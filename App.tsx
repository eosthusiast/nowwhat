
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import JourneySection from './components/JourneySection';
import AudioAlchemizer from './components/AudioAlchemizer';
import Descent from './components/Descent';
import { AppStage } from './types';

// DEV TOGGLE: Set to false to enable the intended gated/locked experience.
const IS_DEV_MODE = false;

// Dawn gradient color keyframes - dark blues, minimal purple
const DAWN_COLORS = {
  night: '#050508',      // Pure black (Hero)
  deepNavy: '#080a12',   // Very dark navy (Journey start)
  darkBlue: '#0c1018',   // Dark blue (Journey end)
  slateBlue: '#101520',  // Slate blue (Audio start)
  deepSlate: '#1a2030',  // Deep slate (Audio 50%)
  duskSlate: '#2a3040',  // Dusk slate (Audio end - flash starts here)
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

  // In Dev Mode, we pre-unlock all stages so the full flow is visible.
  const [unlockedStages, setUnlockedStages] = useState<Set<AppStage>>(
    new Set(IS_DEV_MODE ? Object.values(AppStage) : [AppStage.HERO])
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Global background color with gradual dawn transition
  const getBackgroundColor = () => {
    switch (stage) {
      case AppStage.HERO:
        // Pure black for Hero
        return DAWN_COLORS.night;
      case AppStage.JOURNEY:
        // Slightly lighter blue-tinted shade to contrast with Hero
        return '#0e1420';
      case AppStage.AUDIO:
        // Gradual transition through slate blues (much darker, less purple)
        const p = audioProgress / 100;
        if (p < 0.5) {
          return lerpColor(DAWN_COLORS.slateBlue, DAWN_COLORS.deepSlate, p * 2);
        } else {
          return lerpColor(DAWN_COLORS.deepSlate, DAWN_COLORS.duskSlate, (p - 0.5) * 2);
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
          <section id="journey" className="min-h-screen" style={{ backgroundColor: '#1a1a22' }}>
            <JourneySection />
          </section>
        )}

        {unlockedStages.has(AppStage.AUDIO) && (
          <section id="audio" className="h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#101520' }}>
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
