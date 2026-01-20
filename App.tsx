
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Cpu, 
  Palette, 
  Users, 
  Sprout, 
  ArrowDown, 
  Calendar, 
  MapPin, 
  Flame, 
  CheckCircle, 
  Mail 
} from 'lucide-react';

// --- Constants ---

const ROTATING_STATEMENTS = [
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

const ROTATING_QUESTIONS = [
  "What if sociopaths could not be in leadership positions?",
  "What if self-development and learning to work with your nervous system was offered to all?",
  "What if kids were actually running for president?",
  "What if everyone had a therapist?",
  "What if everyone's basic survival needs were met?",
  "What if everyone was deeply connected to land and ancestry?",
  "What if we need more questions than more answers?",
  "What if collaboration didn't feel competitive?",
  "What if funding flowed to what wants to emerge?",
  "What if wisdom guided technology?",
  "What if joy fueled the work rather than being its reward?",
  "What if different worlds could bridge without friction?"
];

// --- Sub-components ---

const FadeInWhenVisible: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1.2, ease: [0.21, 1.02, 0.47, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Section: React.FC<{ children: React.ReactNode, className?: string, id?: string }> = ({ children, className, id }) => (
  <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 xl:px-32 ${className}`}>
    {children}
  </section>
);

// --- Main App ---

export default function App() {
  const [statementIndex, setStatementIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % ROTATING_STATEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % ROTATING_QUESTIONS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-parchment text-ink selection:bg-terracotta selection:text-white">
      {/* Background Texture/Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-50 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      {/* Floating Organic Decorative Shapes */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed -top-24 -left-24 w-96 h-96 bg-sand/20 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed top-1/2 -right-24 w-[30rem] h-[30rem] bg-forest/5 rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* Hero Section */}
      <header className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden px-6 text-center w-full py-12">
        {/* Main Statement Rotator and "now what?" - Centered */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 md:gap-x-6 lg:gap-x-8 z-10 w-full max-w-full flex-grow">
          {/* Rotating statement part */}
          <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center md:justify-end md:flex-[2] min-w-0">
            <AnimatePresence mode="wait">
              <motion.h2
                key={statementIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-[5vw] md:text-[3.5vw] lg:text-[3vw] font-extrabold leading-none text-forest/90 font-serif whitespace-nowrap md:text-right"
              >
                {ROTATING_STATEMENTS[statementIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Static "now what?" part */}
          <div className="flex items-center justify-center md:justify-start md:flex-1 min-w-0 mt-2 md:mt-0">
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="text-[5vw] md:text-[3.5vw] lg:text-[3vw] font-extrabold italic font-serif text-forest tracking-tighter whitespace-nowrap lowercase leading-none md:text-left"
            >
              now what?
            </motion.h1>
          </div>
        </div>

        {/* Whisper Tagline at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="w-full z-10 mb-8 md:mb-12"
        >
          <p className="text-forest/20 font-light text-sm md:text-base lg:text-lg tracking-wide leading-relaxed max-w-3xl mx-auto">
            Opening doors to radical possibility for those who shape the world.
          </p>
        </motion.div>
      </header>

      {/* Section 2: The Journey Circle */}
      <Section className="bg-white/50 border-y border-sand/30">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            {/* Enso Circle Container */}
            <div className="relative w-full max-w-2xl mx-auto aspect-square">
              {/* SVG Enso Circle */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Enso circle - not fully closed */}
                <path
                  d="M 350 200 A 150 150 0 1 0 50 200 A 150 150 0 1 0 340 220"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-forest/30"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-forest mb-2">
                    Two Weeks
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-forest/70">
                    30 People
                  </p>
                </div>
              </div>

              {/* Journey Stop 1: Call to Adventure (Top) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-parchment p-4 rounded-xl border border-forest/20 shadow-sm">
                  <p className="text-sm md:text-base font-serif text-forest whitespace-nowrap">
                    Call to Adventure
                  </p>
                </div>
              </div>

              {/* Journey Stop 2: Unexpected Experience (Right) */}
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-parchment p-4 rounded-xl border border-forest/20 shadow-sm">
                  <p className="text-sm md:text-base font-serif text-forest whitespace-nowrap">
                    Unexpected Experience
                  </p>
                </div>
              </div>

              {/* Journey Stop 3: Finding Kinship (Bottom) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center">
                <div className="bg-parchment p-4 rounded-xl border border-forest/20 shadow-sm">
                  <p className="text-sm md:text-base font-serif text-forest whitespace-nowrap">
                    Finding Kinship
                  </p>
                </div>
              </div>

              {/* Journey Stop 4: Sharing with the World (Left) */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-parchment p-4 rounded-xl border border-forest/20 shadow-sm">
                  <p className="text-sm md:text-base font-serif text-forest whitespace-nowrap">
                    Sharing with the World
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible className="mt-16">
            <div className="text-center space-y-4">
              <p className="text-lg md:text-xl font-light text-ink/80">
                We gather inspired minds and create the conditions where unexpected collaborations naturally emerge.
              </p>
              <p className="italic text-terracotta text-lg">
                Whatever wants to be born: startups, movements, films, communities.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 3: Question Rotator */}
      <Section className="bg-sand/10">
        <div className="max-w-5xl mx-auto">
          <FadeInWhenVisible>
            <div className="h-32 md:h-40 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={questionIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-forest/70 font-serif italic px-4 text-center"
                >
                  {ROTATING_QUESTIONS[questionIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 4: The Convergence Moment */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight">
              The Convergence Moment
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80">
              <p>
                We're at a threshold. AI, climate, and collective incoherence are accelerating faster than our solutions. The old incentives aren't working. The standard approaches aren't aligned to what humanity actually needs.
              </p>
              <p className="font-medium text-forest text-2xl">
                The question is: now what?
              </p>
              <p>
                The answer isn't found by adding more frameworks or strategies. It's revealed when you bring the right people together, remove what obstructs their natural brilliance, and make it effortless to build what emerges.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 5: Four Core Conditions */}
      <Section className="bg-white/50">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest text-center mb-6">
              The Conditions for Alchemy
            </h2>
            <p className="text-center text-lg md:text-xl text-ink/70 max-w-3xl mx-auto">
              We create four essential conditions that make the extraordinary inevitable.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Unlikely Combinations",
                summary: "Cross-sector collisions that spark the new",
                detail: "What happens when a technologist meets an indigenous knowledge keeper? When a filmmaker collaborates with a consciousness researcher? We bring together people from radically different worlds and create the conditions for these meetings to matter."
              },
              {
                title: "Effortless Building",
                summary: "Remove every obstacle to creation",
                detail: "Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion. We provide immediate funding, infrastructure, time, space, and remove the logistical friction, institutional barriers, and scarcity thinking that kills momentum."
              },
              {
                title: "Fertile Soil",
                summary: "The ground from which emergence happens",
                detail: "Time spent free from distractions and less caught up in the mind. A process that unveils what's actually there. Swimming, sauna, silence, embodiment. We don't prescribe the form—we create the conditions for what wants to emerge."
              },
              {
                title: "Available People",
                summary: "Presence and commitment to what emerges",
                detail: "You're here fully. Two weeks of complete presence. Ready to commit to what captures you. No hedging, no backup plans. Available to row this boat with allies from completely different worlds who are asking the same essential questions."
              }
            ].map((condition, idx) => (
              <FadeInWhenVisible key={idx} className="group">
                <div className="h-full bg-parchment p-8 rounded-2xl border border-sand/20 shadow-sm hover:shadow-2xl hover:border-terracotta/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                  <h3 className="text-2xl md:text-3xl font-serif text-forest mb-3 group-hover:text-terracotta transition-colors">
                    {condition.title}
                  </h3>
                  <p className="text-lg text-ink/70 mb-4 font-medium">
                    {condition.summary}
                  </p>
                  <p className="text-base text-ink/60 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {condition.detail}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </Section>


      {/* Section 6: Who This Is For */}
      <Section className="bg-white/50">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight text-center">
              Who This Is For
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80">
              <p>
                You touched people in meaningful ways. You have created amazing things. You feel what's at stake. You're standing at an empty page, asking "now what?" The answer lies outside your usual circles.
              </p>
              <p className="text-xl font-medium text-forest mt-8">
                You need allies from completely different worlds asking the same essential questions, who are willing to row this boat together with you.
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible className="mt-16">
            <div className="bg-sand/10 p-8 md:p-12 rounded-2xl border-l-4 border-terracotta">
              <h3 className="text-2xl md:text-3xl font-serif text-forest mb-6">
                Selection Criteria
              </h3>
              <div className="space-y-4 text-lg text-ink/80">
                <p className="font-medium">
                  We look for two essential qualities:
                </p>
                <div className="space-y-4 ml-4">
                  <div>
                    <span className="font-semibold text-terracotta">Available:</span> You can commit two full weeks of presence. No hedging. No backup plans. You're here.
                  </div>
                  <div>
                    <span className="font-semibold text-terracotta">Willing to Commit:</span> If something captures you during these two weeks, you're ready to commit the next two years to building it. You're not here to browse—you're here to begin.
                  </div>
                </div>
                <p className="mt-6 italic text-ink/70">
                  Everything else—your background, sector, credentials—matters less than these two qualities. What matters is that you're ready.
                </p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 9: The Four Threads */}
      <Section className="bg-sand/10">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest text-center mb-6">
              The Four Threads
            </h2>
            <p className="text-center text-lg md:text-xl text-ink/80 max-w-3xl mx-auto">
              We bring together people from four distinct lineages:
            </p>
          </FadeInWhenVisible>

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
              },
            ].map((thread, idx) => (
              <FadeInWhenVisible key={idx} className="group">
                <div className="h-full bg-white p-8 rounded-2xl border border-sand/20 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                  <div className="mb-6 text-terracotta group-hover:scale-110 transition-transform duration-500">
                    {thread.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-forest mb-4">{thread.title}</h3>
                  <p className="text-ink/70 leading-relaxed flex-grow">{thread.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          <FadeInWhenVisible className="mt-12 text-center text-lg md:text-xl text-ink/80 max-w-3xl mx-auto">
            Each brings what the others need. Together, something neither predictable nor replicable emerges.
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 10: The Vision */}
      <Section className="bg-sand/10">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight text-center">
              The Vision
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80 text-center">
              <p>
                We imagine a world where everything that makes us human becomes the foundation for building what's possible. Where together we create solutions none could envision alone.
              </p>
              <p>
                Where meeting survival needs and building regenerative futures is funded, supported, and already in motion.
              </p>
              <p className="text-2xl md:text-3xl font-serif text-terracotta italic mt-8">
                Unimaginable collaborations leading to unimaginable solutions.
              </p>
              <p>
                Startups. Movements. Films. Communities. Technologies. Initiatives. Whatever gets alchemized.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 11: Call to Action / Footer */}
      <Section className="pb-12 text-center">
        <FadeInWhenVisible>
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-sand/40 shadow-2xl relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-forest text-parchment p-3 rounded-full">
              <Mail className="w-6 h-6" />
            </div>
            
            <h2 className="text-4xl font-serif text-forest mb-4">Begin</h2>
            <p className="text-ink/80 mb-2 text-xl font-light">
              The alchemical moment is now. The threshold is here.
            </p>
            <p className="text-ink/60 mb-8 text-lg">
              Applications open early 2025. Leave your email to be notified.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow px-6 py-4 rounded-full border border-sand/60 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all bg-parchment/30"
                required
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-forest text-parchment rounded-full font-serif tracking-wide hover:bg-forest/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                Keep me informed
              </button>
            </form>
            
            <p className="mt-8 text-sm text-ink/50 italic">
              "We funded a collaboration between a quantum physicist and a Sufi poet. They're building something that shouldn't exist according to conventional categories. It's working."
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="mt-16 mb-12 max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-light italic text-forest/70 leading-relaxed">
            "Be patient toward all that is unsolved in your heart and try to love the questions themselves."
          </p>
          <p className="mt-4 text-sm md:text-base text-ink/50">
            — Rainer Maria Rilke
          </p>
        </div>

        <footer className="mt-12 pt-12 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-6 text-ink/40 text-sm">
          <div className="font-serif text-lg tracking-tight text-forest/60">Now What Alchemizer 2025</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-terracotta transition-colors">Instagram</a>
            <a href="#" className="hover:text-terracotta transition-colors">Substack</a>
            <a href="mailto:hello@nowwhatalchemizer.com" className="hover:text-terracotta transition-colors">hello@nowwhatalchemizer.com</a>
          </div>
        </footer>
      </Section>

      {/* Back to Top / Floating Element */}
      <motion.div 
        className="fixed bottom-8 right-8 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-forest/5 backdrop-blur-md border border-forest/10 flex items-center justify-center text-forest/40 hover:text-forest hover:bg-forest/10 transition-all"
        >
          <ArrowDown className="w-6 h-6 rotate-180" />
        </button>
      </motion.div>
    </div>
  );
}
