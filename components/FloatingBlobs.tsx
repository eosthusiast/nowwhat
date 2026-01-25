
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppStage } from '../types';

interface FloatingBlobsProps {
  stage: AppStage;
  audioProgress: number;
  descentProgress?: number; // 0-100, tracks scroll through Descent sections
}

// Color palettes for different stages
const BLOB_PALETTES = {
  dark: [
    'rgba(75, 0, 130, 0.4)',    // Indigo
    'rgba(138, 43, 226, 0.35)', // Blue violet
    'rgba(0, 128, 128, 0.3)',   // Teal
    'rgba(148, 0, 211, 0.35)',  // Dark violet
    'rgba(72, 61, 139, 0.4)',   // Dark slate blue
    'rgba(25, 25, 112, 0.35)',  // Midnight blue
  ],
  mid: [
    'rgba(186, 85, 211, 0.35)', // Medium orchid
    'rgba(153, 50, 204, 0.3)',  // Dark orchid
    'rgba(219, 112, 147, 0.3)', // Pale violet red
    'rgba(255, 182, 193, 0.25)',// Light pink
    'rgba(106, 90, 205, 0.35)', // Slate blue
    'rgba(147, 112, 219, 0.3)', // Medium purple
  ],
  // Ethereal light palette for Descent - living light
  descentEarly: [
    'rgba(255, 200, 120, 0.3)',  // Honey gold
    'rgba(255, 180, 160, 0.28)', // Dawn rose
    'rgba(255, 255, 240, 0.4)',  // Creamy highlight
    'rgba(255, 210, 180, 0.32)', // Warm peach
    'rgba(255, 225, 200, 0.35)', // Soft amber
    'rgba(255, 190, 170, 0.3)',  // Blush
  ],
  descentMid: [
    'rgba(255, 185, 130, 0.32)', // Deeper gold
    'rgba(255, 165, 145, 0.3)',  // Warmer rose
    'rgba(255, 245, 235, 0.38)', // Bright cream
    'rgba(255, 195, 165, 0.34)', // Rich peach
    'rgba(255, 205, 175, 0.32)', // Golden amber
    'rgba(255, 180, 160, 0.3)',  // Sunset blush
  ],
  descentLate: [
    'rgba(255, 175, 125, 0.3)',  // Sunset gold
    'rgba(255, 155, 135, 0.28)', // Evening rose
    'rgba(255, 240, 230, 0.35)', // Warm cream
    'rgba(255, 185, 155, 0.32)', // Amber glow
    'rgba(255, 200, 165, 0.3)',  // Late light
    'rgba(255, 170, 150, 0.28)', // Dusk pink
  ],
};

// Individual blob configuration
interface BlobConfig {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

// Dark stage blob config - standard
const DARK_BLOBS: BlobConfig[] = [
  { id: 1, size: 600, initialX: -10, initialY: -20, duration: 25, delay: 0 },
  { id: 2, size: 500, initialX: 70, initialY: 10, duration: 30, delay: 2 },
  { id: 3, size: 450, initialX: 20, initialY: 60, duration: 22, delay: 4 },
  { id: 4, size: 550, initialX: 80, initialY: 70, duration: 28, delay: 1 },
  { id: 5, size: 400, initialX: 40, initialY: 30, duration: 20, delay: 3 },
  { id: 6, size: 480, initialX: 60, initialY: 85, duration: 26, delay: 5 },
];

// Light stage blob config - larger, slower, more meditative
const LIGHT_BLOBS: BlobConfig[] = [
  { id: 1, size: 700, initialX: -15, initialY: -25, duration: 35, delay: 0 },
  { id: 2, size: 600, initialX: 65, initialY: 5, duration: 40, delay: 2 },
  { id: 3, size: 550, initialX: 15, initialY: 55, duration: 32, delay: 4 },
  { id: 4, size: 650, initialX: 75, initialY: 65, duration: 38, delay: 1 },
  { id: 5, size: 500, initialX: 35, initialY: 25, duration: 30, delay: 3 },
  { id: 6, size: 580, initialX: 55, initialY: 80, duration: 36, delay: 5 },
];

const FloatingBlobs: React.FC<FloatingBlobsProps> = ({ stage, audioProgress, descentProgress = 0 }) => {
  const isDescent = stage === AppStage.DESCENT;

  // Use different blob configs for light vs dark stages
  const blobs = useMemo(() => isDescent ? LIGHT_BLOBS : DARK_BLOBS, [isDescent]);

  // Blur amount - larger for Descent's ethereal look
  const blurAmount = isDescent ? 150 : 100;

  // Determine which palette to use based on stage and progress
  const getColors = () => {
    switch (stage) {
      case AppStage.HERO:
      case AppStage.JOURNEY:
        return BLOB_PALETTES.dark;
      case AppStage.AUDIO:
        // Blend from dark to mid based on audio progress
        if (audioProgress < 50) {
          return BLOB_PALETTES.dark;
        }
        return BLOB_PALETTES.mid;
      case AppStage.DESCENT:
        // Shift warmth through Descent based on scroll progress
        if (descentProgress < 33) {
          return BLOB_PALETTES.descentEarly;
        } else if (descentProgress < 66) {
          return BLOB_PALETTES.descentMid;
        }
        return BLOB_PALETTES.descentLate;
      default:
        return BLOB_PALETTES.dark;
    }
  };

  const colors = getColors();

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {blobs.map((blob, index) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.initialX}%`,
            top: `${blob.initialY}%`,
            filter: `blur(${blurAmount}px)`,
            willChange: 'transform',
            mixBlendMode: 'normal',
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
          }}
          animate={{
            x: isDescent
              ? [0, 40, -25, 15, -30, 0]  // Gentler movement for Descent
              : [0, 50, -30, 20, -40, 0],
            y: isDescent
              ? [0, -30, 25, -15, 35, 0]  // Gentler movement for Descent
              : [0, -40, 30, -20, 50, 0],
            scale: isDescent
              ? [1, 1.08, 0.95, 1.03, 0.97, 1]  // Subtler scaling for Descent
              : [1, 1.1, 0.9, 1.05, 0.95, 1],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            animate={{
              backgroundColor: colors[index % colors.length],
            }}
            transition={{
              duration: isDescent ? 3 : 2,  // Slower color transitions for Descent
              ease: 'easeInOut',
            }}
            style={{
              background: colors[index % colors.length],
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingBlobs;
