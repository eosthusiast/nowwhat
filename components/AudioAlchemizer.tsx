
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Headset, Waves } from 'lucide-react';
import { QUESTION_ROTATOR } from '../constants';

enum AudioPhase {
  IDLE = 'IDLE',
  DROP_IN = 'DROP_IN',
  QUESTIONS = 'QUESTIONS',
  CONTEMPLATING = 'CONTEMPLATING',
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate remaining time for countdown
  const remainingTime = Math.max(0, Math.ceil(audioDuration - audioCurrentTime));
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Skip to finished phase
  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(AudioPhase.FINISHED);
  };

  const handleNextStep = () => {
    setIsTransitioning(true);
    // Flash expands over 1s, then we unlock and scroll while still white
    setTimeout(() => {
      onUnlock();
      // Scroll to descent section immediately while screen is still white
      const descentEl = document.getElementById('descent');
      if (descentEl) {
        descentEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000); // Trigger scroll after expansion completes
  };

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    
    setPhase(AudioPhase.DROP_IN);
    setTimer(0);
    
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const next = prev + 1;

        // Transition to questions phase after 23s drop-in
        if (next >= 23 && phase !== AudioPhase.QUESTIONS) {
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
      // Song is 4:15 (255s). Timeline: 23s drop-in + 7 questions × 29s each (203s) + ~29s contemplation
      const dropInDuration = 23;
      const questionDuration = 29; // Each question displays for 29 seconds
      const relativeTime = timer - dropInDuration;
      const index = Math.floor(relativeTime / questionDuration);

      // Check if we've gone past all questions
      if (index >= QUESTION_ROTATOR.length) {
        setPhase(AudioPhase.CONTEMPLATING);
      } else {
        setQuestionIndex(Math.max(0, index));
      }
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
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
          }
        }}
        src={`${import.meta.env.BASE_URL}audio/ambient.mp3`}
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
                Put away distractions, wear headphones, and get ready.
              </p>
              <div className="flex items-center justify-center gap-2 text-indigo-500/60">
                <Headset className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest">Contemplative Experience (4:15)</span>
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
                    Take some time to drop in.
                  </motion.p>
                ) : (
                  <motion.p
                    key={questionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1 }}
                    className="text-3xl md:text-5xl font-serif text-white max-w-2xl mx-auto leading-[6.0]"
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

        {phase === AudioPhase.CONTEMPLATING && (
          <motion.div
            key="contemplating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-center space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-serif italic text-white/80"
              >
                Keep listening. Let the questions sit with you.
              </motion.p>

              {/* Countdown timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-indigo-400/60 font-sans text-sm tracking-widest"
              >
                {formatTime(remainingTime)} remaining
              </motion.div>
            </div>

            {/* Waves animation */}
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
              <Waves className="w-8 h-8 text-indigo-400/40" />
            </motion.div>

            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="text-white/40 hover:text-white/70 font-sans text-xs tracking-widest uppercase transition-colors"
            >
              Skip to continue
            </motion.button>
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
              {/* Small white circle indicator */}
              <motion.div
                className="w-4 h-4 bg-white rounded-full mx-auto mb-6"
                animate={isTransitioning ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
              <h3 className="text-4xl font-serif text-white font-bold">The questions remain.</h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              disabled={isTransitioning}
              className="px-12 py-4 rounded-full border border-white/50 text-white font-sans tracking-widest uppercase text-sm transition-all bg-white/10"
            >
              Ready to take the next step?
            </motion.button>
          </motion.div>
        )}

        {/* Full-screen flash transition overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2.5, duration: 0.75, ease: "easeOut" }}
            >
              <motion.div
                className="bg-white rounded-full"
                initial={{ width: 16, height: 16 }}
                animate={{
                  width: '300vmax',
                  height: '300vmax',
                  transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default AudioAlchemizer;
