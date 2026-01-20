
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Headset, CheckCircle2, Waves } from 'lucide-react';
import { QUESTION_ROTATOR } from '../constants';

enum AudioPhase {
  IDLE = 'IDLE',
  DROP_IN = 'DROP_IN',
  QUESTIONS = 'QUESTIONS',
  FINISHED = 'FINISHED'
}

interface AudioAlchemizerProps {
  onUnlock: () => void;
  isUnlocked: boolean;
}

const AudioAlchemizer: React.FC<AudioAlchemizerProps> = ({ onUnlock, isUnlocked }) => {
  const [phase, setPhase] = useState<AudioPhase>(isUnlocked ? AudioPhase.FINISHED : AudioPhase.IDLE);
  const [timer, setTimer] = useState(0); // Internal timer for text rotation logic
  const [questionIndex, setQuestionIndex] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    
    setPhase(AudioPhase.DROP_IN);
    setTimer(0);
    
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const next = prev + 1;
        
        // Logical Phase transition for UI text (not dependent on exact audio end yet)
        if (next >= 30 && phase !== AudioPhase.QUESTIONS) {
          setPhase(AudioPhase.QUESTIONS);
        }

        return next;
      });
    }, 1000);
  };

  const handleAudioEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(AudioPhase.FINISHED);
  };

  useEffect(() => {
    if (phase === AudioPhase.QUESTIONS) {
      // Each question 23 seconds
      const relativeTime = timer - 30;
      const index = Math.floor(relativeTime / 23) % QUESTION_ROTATOR.length;
      setQuestionIndex(index);
    }
  }, [timer, phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl px-6 text-center">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        src="/audio/ambient.mp3"
      />

      <AnimatePresence mode="wait">
        {phase === AudioPhase.IDLE && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startAudio}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-indigo-500/50 flex items-center justify-center group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-indigo-500/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <Play className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 group-hover:text-white transition-colors ml-2" />
              <span className="absolute bottom-6 md:bottom-10 text-[10px] tracking-widest uppercase text-indigo-400">Listen</span>
            </motion.button>
            
            <div className="space-y-4 max-w-sm">
              <p className="text-gray-400 font-sans text-sm tracking-wide leading-relaxed">
                Use laptop, put away distractions, wear headphones, and get ready.
              </p>
              <div className="flex items-center justify-center gap-2 text-indigo-500/60">
                <Headset className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest">Contemplative Experience (3:00)</span>
              </div>
            </div>
          </motion.div>
        )}

        {(phase === AudioPhase.DROP_IN || phase === AudioPhase.QUESTIONS) && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            <div className="h-40 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {phase === AudioPhase.DROP_IN ? (
                  <motion.p
                    key="dropin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl md:text-4xl font-serif italic text-white"
                  >
                    We take 30s to drop in.
                  </motion.p>
                ) : (
                  <motion.p
                    key={questionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1 }}
                    className="text-3xl md:text-5xl font-serif text-white max-w-2xl mx-auto leading-tight"
                  >
                    {QUESTION_ROTATOR[questionIndex]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Progress indicators hidden for immersion, only subtle pulse remains */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  <Waves className="w-6 h-6 text-indigo-400/40" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === AudioPhase.FINISHED && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-4xl font-serif text-white font-bold">The questions remain.</h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onUnlock}
              className="px-12 py-4 rounded-full border border-indigo-500 text-white font-sans tracking-widest uppercase text-sm transition-all bg-indigo-500/20"
            >
              Ready to take the next step?
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioAlchemizer;
