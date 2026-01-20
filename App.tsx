
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Cpu, Palette, Users, Sprout } from 'lucide-react';

// --- Constants ---

const HERO_STATEMENTS = [
  "You built a unicorn...",
  "You had a life-changing experience...",
  "Climate change is accelerating...",
  "The biosphere is collapsing...",
  "People are addicted to screens...",
  "AI is evolving faster than wisdom...",
  "You've done the inner work...",
  "Your industry is shifting...",
  "Old systems are reaching their limit...",
  "You've made your fortune...",
  "Your meditation practice is deep...",
  "The world feels upside down...",
  "You have resources and seek direction...",
  "Your kids are asking hard questions...",
  "You sold your company...",
  "You've seen behind the curtain...",
  "The mushrooms showed you a path...",
  "You have more money than meaning...",
  "The news is overwhelming...",
  "You're ready for true change...",
  "You're ready to serve what's next..."
];

const CONTEMPLATIVE_QUESTIONS = [
  "What if sociopaths could not be in leadership positions?",
  "What if self-development and learning to work with your nervous system was offered to all?",
  "What if everyone's basic survival needs were met?",
  "What if everyone was deeply connected to land and ancestry?",
  "What if we need more questions than more answers?",
  "What if collaboration didn't feel competitive?",
  "What if funding flowed to what wants to emerge?",
  "What if wisdom guided technology?"
];

// --- Main App ---

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { scrollYProgress } = useScroll();

  // Transform scroll to color values - dawn transition
  // Start dark and gradually lighten as user scrolls through the journey
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
    [
      'rgb(15, 23, 42)',      // Deep night blue - start here
      'rgb(15, 23, 42)',      // Hold dark for initial hero
      'rgb(30, 41, 59)',      // Pre-dawn
      'rgb(51, 65, 85)',      // Dawn breaking
      'rgb(100, 116, 139)',   // Early morning
      'rgb(139, 152, 176)',   // Mid-morning
      'rgb(203, 213, 225)',   // Light morning
      'rgb(241, 245, 249)'    // Full daylight
    ]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.3, 0.5, 0.7, 0.85],
    [
      'rgb(226, 232, 240)',   // Light text on dark - start
      'rgb(226, 232, 240)',   // Hold light for initial dark background
      'rgb(203, 213, 225)',
      'rgb(100, 116, 139)',
      'rgb(71, 85, 105)',
      'rgb(51, 65, 85)'       // Dark text on light
    ]
  );

  // Hero statements rotator
  useEffect(() => {
    if (hasEntered && !showQuestions) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_STATEMENTS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hasEntered, showQuestions]);

  // Audio-driven question timing - questions appear based on audio playback time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioStarted) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;

      // Questions start appearing after 5 seconds
      if (currentTime >= 5) {
        setShowCurrentQuestion(true);
        // Calculate which question to show: changes every 23 seconds after the 5s delay
        const newIndex = Math.min(
          Math.floor((currentTime - 5) / 23),
          CONTEMPLATIVE_QUESTIONS.length - 1
        );
        setQuestionIndex(newIndex);
      } else {
        setShowCurrentQuestion(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [audioStarted]);

  // Audio no longer auto-plays on enter - only when Listen button is clicked

  // Prevent scrolling past question section until Continue is clicked
  useEffect(() => {
    const handleScroll = () => {
      if (!showQuestions) {
        const questionSection = document.getElementById('questions-section');
        if (questionSection) {
          const questionTop = questionSection.offsetTop;
          const scrollPosition = window.scrollY;

          // If scrolled past the question section, snap back to it
          if (scrollPosition > questionTop + 200) {
            window.scrollTo({
              top: questionTop + 200,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    if (!showQuestions) {
      window.addEventListener('scroll', handleScroll, { passive: false });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showQuestions]);

  const handleAudioEnd = () => {
    setAudioEnded(true);
  };

  const handleListenClick = () => {
    if (audioRef.current) {
      setAudioStarted(true);
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleContinueClick = () => {
    setShowQuestions(true);
  };

  if (!hasEntered) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <motion.button
          onClick={() => setHasEntered(true)}
          className="px-12 py-6 text-xl font-light text-slate-200 border border-slate-600 rounded-sm hover:bg-slate-800 transition-all duration-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Enter
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      style={{ backgroundColor }}
      className="min-h-screen relative"
    >
      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
      >
        <source src="/audio/ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Hero Section - Statements and "now what?" */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <motion.div
          style={{ color: textColor }}
          className="max-w-6xl mx-auto text-center space-y-12"
        >
          {/* Statement/Question Rotator */}
          <div className="h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={heroIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-wide"
              >
                {HERO_STATEMENTS[heroIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* now what? */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-light italic tracking-tight"
          >
            now what?
          </motion.h1>
        </motion.div>
      </section>

      {/* Journey Circle */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          style={{ color: textColor }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative w-full max-w-2xl mx-auto aspect-square"
          >
            {/* SVG Enso Circle */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <motion.path
                d="M 350 200 A 150 150 0 1 0 50 200 A 150 150 0 1 0 340 220"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 3, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <p className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider">
                  Two Weeks
                </p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wider opacity-70">
                  30 People
                </p>
              </motion.div>
            </div>

            {/* Journey Stops */}
            {[
              { text: "Call to Adventure", position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
              { text: "Unexpected Experience", position: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" },
              { text: "Finding Kinship", position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
              { text: "Sharing with the World", position: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" }
            ].map((stop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2 + (idx * 0.3), duration: 1 }}
                viewport={{ once: true }}
                className={`absolute ${stop.position} text-center`}
              >
                <div className="px-4 py-2 border border-current rounded-sm backdrop-blur-sm bg-slate-900/10">
                  <p className="text-xs md:text-sm font-light whitespace-nowrap tracking-wide">
                    {stop.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center space-y-4"
          >
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-80">
              We gather inspired minds and create the conditions where unexpected collaborations naturally emerge.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Question Pause Section */}
      <section id="questions-section" className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <motion.div
          style={{ color: textColor }}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          {/* Question Display Area - only visible after 5 seconds of audio */}
          {audioStarted && showCurrentQuestion && (
            <div className="h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={questionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed tracking-wide"
                >
                  {CONTEMPLATIVE_QUESTIONS[questionIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}

          {/* Listen Button - shows before audio starts */}
          {!audioStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="space-y-4"
            >
              <button
                onClick={handleListenClick}
                className="px-12 py-4 text-lg font-light border border-slate-400 rounded-sm hover:bg-slate-700/20 transition-all duration-300"
              >
                Listen
              </button>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-sm opacity-60"
              >
                get ready and put on headphones
              </motion.p>
            </motion.div>
          )}

          {/* Continue Button - shows after audio ends */}
          {audioEnded && !showQuestions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-8"
            >
              <button
                onClick={handleContinueClick}
                className="px-12 py-4 text-lg font-light border border-slate-400 rounded-sm hover:bg-slate-700/20 transition-all duration-300"
              >
                Continue
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Rest of content only shows after user continues past questions */}
      {showQuestions && (
        <>
          {/* Convergence */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide"
              >
                The Convergence Moment
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6 text-lg md:text-xl font-light leading-relaxed opacity-80"
              >
                <p>
                  We're at a threshold. AI, climate, and collective incoherence are accelerating faster than our solutions.
                </p>
                <p className="text-2xl md:text-3xl font-light">
                  The question is: now what?
                </p>
                <p>
                  The answer isn't found by adding more frameworks or strategies. It's revealed when you bring the right people together, remove what obstructs their natural brilliance, and make it effortless to build what emerges.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Four Conditions */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-6xl mx-auto"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-center mb-20"
              >
                The Conditions for Alchemy
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    title: "Unlikely Combinations",
                    detail: "What happens when a technologist meets an indigenous knowledge keeper? We bring together people from radically different worlds and create the conditions for these meetings to matter."
                  },
                  {
                    title: "Effortless Building",
                    detail: "Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion. We provide immediate funding, infrastructure, time, space."
                  },
                  {
                    title: "Fertile Soil",
                    detail: "Time spent free from distractions and less caught up in the mind. Swimming, sauna, silence, embodiment. We don't prescribe the form—we create the conditions for what wants to emerge."
                  },
                  {
                    title: "Available People",
                    detail: "You're here fully. Two weeks of complete presence. Ready to commit to what captures you. No hedging, no backup plans."
                  }
                ].map((condition, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2, duration: 1.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl md:text-3xl font-light tracking-wide">
                      {condition.title}
                    </h3>
                    <p className="text-base md:text-lg font-light leading-relaxed opacity-70">
                      {condition.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Who This Is For */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide"
              >
                Who This Is For
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6 text-lg md:text-xl font-light leading-relaxed opacity-80"
              >
                <p>
                  You touched people in meaningful ways. You have created amazing things. You feel what's at stake.
                </p>
                <p>
                  You're standing at an empty page, asking "now what?" The answer lies outside your usual circles.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="pt-8 border-t border-current/20 space-y-8"
              >
                <h3 className="text-2xl md:text-3xl font-light tracking-wide">
                  Selection Criteria
                </h3>
                <div className="space-y-6 opacity-80">
                  <div>
                    <span className="font-normal">Available:</span> You can commit two full weeks of presence. No hedging. No backup plans.
                  </div>
                  <div>
                    <span className="font-normal">Willing to Commit:</span> If something captures you during these two weeks, you're ready to commit the next two years to building it.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Four Threads */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-6xl mx-auto"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-center mb-8"
              >
                The Four Threads
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center text-lg md:text-xl opacity-70 max-w-3xl mx-auto mb-16"
              >
                We bring together people from four distinct lineages:
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Implementers",
                    icon: <Cpu className="w-10 h-10" />,
                    desc: "Technologists, researchers, systems builders, entrepreneurs"
                  },
                  {
                    title: "Artists",
                    icon: <Palette className="w-10 h-10" />,
                    desc: "Filmmakers, musicians, storytellers, visual creators"
                  },
                  {
                    title: "Stewards",
                    icon: <Sprout className="w-10 h-10" />,
                    desc: "Indigenous wisdom keepers, spiritual elders, consciousness explorers"
                  },
                  {
                    title: "Alchemists",
                    icon: <Users className="w-10 h-10" />,
                    desc: "Relational practitioners, embodiment guides, space holders"
                  }
                ].map((thread, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 1.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-4 text-center"
                  >
                    <div className="flex justify-center opacity-60">
                      {thread.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-light tracking-wide">
                      {thread.title}
                    </h3>
                    <p className="text-sm md:text-base font-light leading-relaxed opacity-60">
                      {thread.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 text-center text-lg md:text-xl opacity-70 max-w-3xl mx-auto"
              >
                Each brings what the others need. Together, something neither predictable nor replicable emerges.
              </motion.p>
            </motion.div>
          </section>

          {/* Vision */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-3xl mx-auto space-y-8 text-center"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide"
              >
                The Vision
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-8 text-lg md:text-xl font-light leading-relaxed opacity-80"
              >
                <p>
                  We imagine a world where everything that makes us human becomes the foundation for building what's possible.
                </p>
                <p className="text-2xl md:text-3xl italic font-light">
                  Unimaginable collaborations leading to unimaginable solutions.
                </p>
                <p>
                  Whatever gets alchemized.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="min-h-screen flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-4xl md:text-5xl font-light tracking-wide"
              >
                Begin
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-xl md:text-2xl font-light opacity-80"
              >
                The alchemical moment is now. The threshold is here.
              </motion.p>
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-grow px-6 py-4 bg-transparent border border-current/30 rounded-sm focus:outline-none focus:border-current/60 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 border border-current/50 rounded-sm hover:bg-current/10 transition-all"
                >
                  Keep me informed
                </button>
              </motion.form>
            </motion.div>
          </section>

          {/* Rilke Quote Footer */}
          <section className="min-h-[50vh] flex items-center justify-center px-6 py-24">
            <motion.div
              style={{ color: textColor }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl font-light italic leading-relaxed opacity-70"
              >
                "Be patient toward all that is unsolved in your heart and try to love the questions themselves."
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                viewport={{ once: true }}
                className="text-sm md:text-base opacity-50"
              >
                — Rainer Maria Rilke
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                viewport={{ once: true }}
                className="pt-12 text-sm opacity-40 space-y-2"
              >
                <p>Now What Alchemizer 2025</p>
                <p>hello@nowwhatalchemizer.com</p>
              </motion.div>
            </motion.div>
          </section>
        </>
      )}
    </motion.div>
  );
}
