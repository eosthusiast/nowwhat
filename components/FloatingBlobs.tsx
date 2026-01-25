
import React from 'react';
import { motion } from 'framer-motion';
import { AppStage } from '../types';

interface FloatingBlobsProps {
  stage: AppStage;
  audioProgress: number;
  descentProgress?: number;
}

// Color palettes for different stages
const GRADIENT_COLORS = {
  // Hero - very dark, subtle navy/blue
  hero: {
    primary: 'rgba(10, 15, 35, 0.6)',
    secondary: 'rgba(15, 25, 55, 0.4)',
  },
  // Journey/early Audio - dark blue-grays
  dark: {
    primary: 'rgba(25, 25, 45, 0.5)',
    secondary: 'rgba(30, 30, 50, 0.35)',
  },
  // Audio end - warm tones
  mid: {
    primary: 'rgba(255, 180, 160, 0.4)',
    secondary: 'rgba(255, 200, 120, 0.3)',
  },
  // Descent - warm dawn colors
  descent: {
    primary: 'rgba(255, 200, 120, 0.35)',
    secondary: 'rgba(255, 180, 160, 0.25)',
  },
};

const FloatingBlobs: React.FC<FloatingBlobsProps> = ({ stage, audioProgress, descentProgress = 0 }) => {
  const isAudio = stage === AppStage.AUDIO;
  const isDescent = stage === AppStage.DESCENT;

  // Interpolate between two color objects
  const lerpColors = (colors1: typeof GRADIENT_COLORS.dark, colors2: typeof GRADIENT_COLORS.mid, t: number) => {
    const parseRgba = (c: string) => {
      const match = c.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4])];
      return [0, 0, 0, 0];
    };
    const lerpSingle = (c1: string, c2: string) => {
      const [r1, g1, b1, a1] = parseRgba(c1);
      const [r2, g2, b2, a2] = parseRgba(c2);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      const a = (a1 + (a2 - a1) * t).toFixed(2);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    return {
      primary: lerpSingle(colors1.primary, colors2.primary),
      secondary: lerpSingle(colors1.secondary, colors2.secondary),
    };
  };

  // Get colors based on stage and progress
  const getColors = () => {
    switch (stage) {
      case AppStage.HERO:
        return GRADIENT_COLORS.hero;
      case AppStage.JOURNEY:
        return GRADIENT_COLORS.dark;
      case AppStage.AUDIO:
        const t = audioProgress / 100;
        return lerpColors(GRADIENT_COLORS.dark, GRADIENT_COLORS.mid, t);
      case AppStage.DESCENT:
        return GRADIENT_COLORS.descent;
      default:
        return GRADIENT_COLORS.dark;
    }
  };

  const colors = getColors();

  // Calculate gradient position - for Audio, the "sunrise" rolls up
  // 0% progress = gradient starts at 100% (bottom), 100% progress = gradient at 60% (risen)
  const gradientStart = isAudio
    ? 100 - (audioProgress * 0.4) // Rolls from 100% to 60%
    : isDescent
      ? 40 // Dawn has risen
      : 70; // Hero/Journey - stays low

  // Opacity increases during Audio stage
  const opacityMultiplier = isAudio ? 1 + (audioProgress / 200) : 1;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Main gradient layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent ${gradientStart - 30}%,
            ${colors.secondary} ${gradientStart - 15}%,
            ${colors.primary} ${gradientStart}%,
            ${colors.primary} 100%
          )`,
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
        }}
        style={{
          opacity: opacityMultiplier,
        }}
      />

      {/* Bottom glow with horizontal drift */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: isDescent ? '50%' : '40%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: ['-5%', '5%', '-5%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            background: `radial-gradient(
              ellipse 120% 80% at 50% 100%,
              ${colors.primary} 0%,
              ${colors.secondary} 40%,
              transparent 70%
            )`,
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
          style={{
            opacity: opacityMultiplier * 0.8,
          }}
        />
      </motion.div>

      {/* Secondary glow layer for depth - slower drift */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: isDescent ? '60%' : '50%',
          filter: 'blur(100px)',
        }}
        animate={{
          x: ['3%', '-3%', '3%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            background: `radial-gradient(
              ellipse 150% 60% at 50% 100%,
              ${colors.secondary} 0%,
              transparent 60%
            )`,
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
          style={{
            opacity: opacityMultiplier * 0.5,
          }}
        />
      </motion.div>
    </div>
  );
};

export default FloatingBlobs;
