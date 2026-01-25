
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
  onProgress?: (progress: number) => void;
}

const AudioAlchemizer: React.FC<AudioAlchemizerProps> = ({ onUnlock, isUnlocked, onProgress }) => {
  const [phase, setPhase] = useState<AudioPhase>(isUnlocked ? AudioPhase.FINISHED : AudioPhase.IDLE);
  const [timer, setTimer] = useState(0); // Internal timer for text rotation logic
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [showEarlyClickHint, setShowEarlyClickHint] = useState(false);
  const [songEnded, setSongEnded] = useState(false);
  const [timerDisabledAfterQ3, setTimerDisabledAfterQ3] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const earlyClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate remaining time for countdown
  const remainingTime = Math.max(0, Math.ceil(audioDuration - audioCurrentTime));
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Report progress to parent for background color transitions
  useEffect(() => {
    if (onProgress && audioDuration > 0) {
      const progress = Math.min(100, (audioCurrentTime / audioDuration) * 100);
      onProgress(progress);
    }
    // Also set to 100% when finished
    if (onProgress && phase === AudioPhase.FINISHED) {
      onProgress(100);
    }
  }, [audioCurrentTime, audioDuration, phase, onProgress]);

  // Skip to finished phase
  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(AudioPhase.FINISHED);
  };

  // Handle click to advance questions (Q3 onwards can click)
  const handleQuestionClick = () => {
    if (phase !== AudioPhase.QUESTIONS) return;

    // Questions 1-2 (index 0-1): show subtle hint
    if (questionIndex < 2) {
      // Clear any existing timeout
      if (earlyClickTimeoutRef.current) {
        clearTimeout(earlyClickTimeoutRef.current);
      }
      setShowEarlyClickHint(true);
      earlyClickTimeoutRef.current = setTimeout(() => {
        setShowEarlyClickHint(false);
      }, 1500);
      return;
    }

    // Question 3 onwards (index 2+): advance to next question
    if (questionIndex >= QUESTION_ROTATOR.length - 1) {
      // On last question, go to CONTEMPLATING if song still playing, else FINISHED
      setTimerDisabledAfterQ3(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current && !audioRef.current.paused && audioRef.current.currentTime < audioRef.current.duration) {
        setPhase(AudioPhase.CONTEMPLATING);
      } else {
        setPhase(AudioPhase.FINISHED);
      }
    } else {
      // If song ended message is showing, dismiss it and return to questions
      if (songEnded) {
        setSongEnded(false);
      }
      setQuestionIndex(prev => prev + 1);
      // Disable auto-timer once user manually advances from Q3
      if (!timerDisabledAfterQ3) {
        setTimerDisabledAfterQ3(true);
      }
    }
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

        // Transition to questions phase after 14s drop-in (60% of original 23s)
        if (next >= 14 && phase !== AudioPhase.QUESTIONS) {
          setPhase(AudioPhase.QUESTIONS);
        }

        return next;
      });
    }, 1000);
  };

  const handleAudioEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // If still on questions, mark song as ended but let user continue clicking through
    if (phase === AudioPhase.QUESTIONS) {
      setSongEnded(true);
    } else {
      setPhase(AudioPhase.FINISHED);
    }
  };

  useEffect(() => {
    if (phase === AudioPhase.QUESTIONS && !timerDisabledAfterQ3) {
      // Song is 4:15 (255s). Timeline: 14s drop-in + questions + contemplation
      const dropInDuration = 14;
      const firstQuestionDuration = 17; // First question is 60% of normal (29s * 0.6 ≈ 17s)
      const normalQuestionDuration = 26; // Other questions display for 26 seconds
      const relativeTime = timer - dropInDuration;

      let index = 0;
      if (relativeTime < firstQuestionDuration) {
        index = 0;
      } else {
        // After first question, calculate index for remaining questions
        const timeAfterFirst = relativeTime - firstQuestionDuration;
        index = 1 + Math.floor(timeAfterFirst / normalQuestionDuration);
      }

      // Auto-timer only advances through Q1-Q3 (index 0-2)
      // After Q3 timer ends naturally, user must click to proceed
      if (index > 2) {
        // Q3 timer ended, disable auto-advancement but stay on Q3
        // User will click to go to Q4
        setTimerDisabledAfterQ3(true);
        return;
      }

      setQuestionIndex(Math.max(0, index));
    }
  }, [timer, phase, timerDisabledAfterQ3]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (earlyClickTimeoutRef.current) clearTimeout(earlyClickTimeoutRef.current);
    };
  }, []);

  // DEV: Press 'E' to skip audio to 5 seconds before end
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (audioRef.current && audioDuration > 0) {
          audioRef.current.currentTime = audioDuration - 5;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioDuration]);

  return (
    <div className="w-full max-w-4xl px-8 md:px-6 text-center relative">
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
              className="w-36 h-36 md:w-48 md:h-48 rounded-full border border-purple-700/50 flex items-center justify-center group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-purple-700/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              <Play className="w-14 h-14 md:w-16 md:h-16 text-purple-600 group-hover:text-white transition-colors ml-2" />
              <span className="absolute bottom-8 md:bottom-10 text-xs tracking-widest uppercase text-purple-600">Listen</span>
            </motion.button>
            
            <div className="space-y-6 max-w-lg">
              <p className="text-gray-400 font-sans text-base tracking-wide leading-relaxed">
                You're going on a journey that's going to take 4 minutes. Put away distractions and wear headphones.
              </p>
              <p className="text-white font-serif text-2xl italic">
                Are you ready?
              </p>
            </div>
          </motion.div>
        )}

        {(phase === AudioPhase.DROP_IN || phase === AudioPhase.QUESTIONS) && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16 cursor-pointer"
            onClick={handleQuestionClick}
          >
            <div className="h-auto min-h-48 md:min-h-40 flex flex-col items-center justify-center">
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
                ) : songEnded ? (
                  <motion.div
                    key="song-ended"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                    <p className="text-2xl md:text-3xl font-serif text-white max-w-2xl mx-auto leading-relaxed px-4">
                      There {QUESTION_ROTATOR.length - questionIndex - 1 === 1 ? 'is' : 'are'} {QUESTION_ROTATOR.length - questionIndex - 1} more question{QUESTION_ROTATOR.length - questionIndex - 1 === 1 ? '' : 's'}.
                    </p>
                    <p className="text-base md:text-lg font-serif text-white/60 mt-4 max-w-xl mx-auto px-4">
                      You can make it through them in your own time now, or write them down to reflect on later.
                    </p>
                    <p className="text-sm text-white/40 mt-8">
                      Click to continue
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                    {(() => {
                      const question = QUESTION_ROTATOR[questionIndex];
                      // Find the last sentence break: `. `, `… `, `" `, or `" ` followed by uppercase
                      let splitIndex = -1;
                      for (let i = question.length - 2; i >= 0; i--) {
                        const char = question[i];
                        const nextChar = question[i + 1];
                        const afterNext = question[i + 2];
                        if (nextChar === ' ' && afterNext && afterNext === afterNext.toUpperCase() && afterNext !== afterNext.toLowerCase()) {
                          if (char === '.' || char === '…' || char === '"' || char === '"') {
                            splitIndex = i;
                            break;
                          }
                        }
                      }
                      if (splitIndex !== -1) {
                        const firstPart = question.slice(0, splitIndex + 1);
                        const secondPart = question.slice(splitIndex + 2);
                        return (
                          <>
                            <p className="text-xl md:text-[2.025rem] font-serif text-white max-w-2xl mx-auto leading-snug px-2">
                              {firstPart}
                            </p>
                            <p className="text-2xl md:text-4xl font-serif text-white max-w-2xl mx-auto leading-snug mt-4 px-2">
                              {secondPart}
                            </p>
                          </>
                        );
                      }
                      return (
                        <p className="text-2xl md:text-4xl font-serif text-white max-w-2xl mx-auto leading-relaxed px-2">
                          {question}
                        </p>
                      );
                    })()}
                    {questionIndex === 1 && (
                      <p className="text-base md:text-xl font-serif text-white/60 mt-4 max-w-xl mx-auto px-4">
                        This might be just stretching your neck or finding your pulse.
                      </p>
                    )}
                    {questionIndex === 2 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="text-sm text-white/40 mt-8 max-w-md mx-auto"
                      >
                        When you're ready, click to continue to the next question.
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Early click hint */}
              <AnimatePresence>
                {showEarlyClickHint && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-white/30 mt-6"
                  >
                    Not yet...
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
                  <Waves className="w-6 h-6 text-purple-600/40" />
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
                className="text-purple-600/60 font-sans text-sm tracking-widest"
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
              <Waves className="w-8 h-8 text-purple-600/40" />
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
              <h3 className="text-3xl md:text-4xl font-serif text-white font-bold">The questions remain...</h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              disabled={isTransitioning}
              className="px-16 py-5 md:px-12 md:py-4 rounded-full border border-white/50 text-white font-sans tracking-wide text-base transition-all bg-white/10"
            >
              Ready when you are.
            </motion.button>

            <p className="text-white/30 font-serif text-base italic mt-8 max-w-md px-4">
              "Be patient toward all that is unsolved in your heart and try to love the questions themselves." — Rainer Maria Rilke
            </p>
          </motion.div>
        )}

        {/* Full-screen sunrise gradient flash transition overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2.5, duration: 0.75, ease: "easeOut" }}
            >
              <motion.div
                className="rounded-full"
                initial={{
                  width: 16,
                  height: 16,
                  backgroundColor: '#6b3a6b' // Start at mauve
                }}
                animate={{
                  width: '300vmax',
                  height: '300vmax',
                  backgroundColor: ['#6b3a6b', '#a87e7a', '#d4a882', '#FFFBF5'], // Mauve → dusty rose → peach → light sunrise
                  transition: {
                    width: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                    height: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                    backgroundColor: { duration: 0.5, ease: "easeOut", times: [0, 0.2, 0.5, 1] }
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* Dev skip button - subtle but accessible */}
      {phase !== AudioPhase.FINISHED && (
        <button
          onClick={handleSkip}
          className="fixed bottom-8 right-8 px-4 py-2 text-xs text-white/10 hover:text-white/30 transition-opacity"
          aria-label="Skip audio experience"
        >
          Skip
        </button>
      )}
    </div>
  );
};

export default AudioAlchemizer;
