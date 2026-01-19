
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

  useEffect(() => {
    const interval = setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % ROTATING_STATEMENTS.length);
    }, 4500);
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
      <header className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 text-center w-full">
        {/* Adjusted flex containers to move the gap to the right (md:w-2/3 and md:w-1/3) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 md:gap-x-6 lg:gap-x-8 z-10 w-full max-w-full">
          
          {/* Rotating statement part - Increased width (flex-[2]) and slightly smaller font */}
          <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center md:justify-end md:flex-[2] min-w-0">
            <AnimatePresence mode="wait">
              <motion.h2
                key={statementIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-[4.5vw] md:text-[3vw] lg:text-[2.4vw] font-extrabold leading-none text-forest/90 font-serif whitespace-nowrap md:text-right"
              >
                {ROTATING_STATEMENTS[statementIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Static part - Decreased width (flex-1), matched smaller font size, and added italic */}
          <div className="flex items-center justify-center md:justify-start md:flex-1 min-w-0 mt-2 md:mt-0">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="text-[4.5vw] md:text-[3vw] lg:text-[2.4vw] font-extrabold italic font-serif text-forest tracking-tighter whitespace-nowrap lowercase leading-none md:text-left"
            >
              now what?
            </motion.h1>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-10 md:mt-12 z-10"
        >
          <p className="text-terracotta font-medium tracking-[0.25em] uppercase text-[10px] md:text-xs lg:text-sm">
            A two-week cocoon for leaders.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ArrowDown className="text-forest/30 w-5 h-5 md:w-6 md:h-6" />
        </motion.div>
      </header>

      {/* Section 2: The Premise */}
      <Section className="bg-white/50 border-y border-sand/30">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight text-center md:text-left">
              A cocoon for those ready to emerge differently.
            </h2>
            <div className="space-y-6 text-xl md:text-2xl font-light leading-relaxed text-ink/80 text-center md:text-left">
              <p>
                The world calls for spaces where brilliant, high-integrity people can drop out of their heads, into their bodies, and from that grounded place—create something that actually matters.
              </p>
              <p>
                <strong className="font-serif text-terracotta italic">now what?</strong> is a two-week cocoon. We prioritize silence, stillness, and deep embodiment through sauna, swimming, and movement. From this foundation, we foster concrete plans and funded projects, joining a cohort of collaborators ready to commit to building what is meaningful.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 3: The Four Threads */}
      <Section>
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest text-center">
              Four ways of knowing, one shared inquiry.
            </h2>
            <p className="text-center mt-4 text-ink/60 max-w-2xl mx-auto italic">
              "The boundary between these threads is permeable. We are looking for those who bridge worlds."
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Tech", 
                icon: <Cpu className="w-10 h-10" />, 
                desc: "Engineers, founders, AI researchers, systems thinkers. Those building the future who want to build it well." 
              },
              { 
                title: "Art", 
                icon: <Palette className="w-10 h-10" />, 
                desc: "Musicians, visual artists, storytellers. Those who translate the ineffable into the felt experience." 
              },
              { 
                title: "Relating", 
                icon: <Users className="w-10 h-10" />, 
                desc: "Facilitators, somatic practitioners, experts in authentic connection. IFS, embodiment, the space between." 
              },
              { 
                title: "Indigenous Wisdom", 
                icon: <Sprout className="w-10 h-10" />, 
                desc: "Wisdom keepers, land-based practitioners. Those who remember what industrial culture forgot." 
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
          
          <FadeInWhenVisible className="mt-12 text-center text-ink/50 text-sm max-w-3xl mx-auto">
            Deep systems thinkers, ecological artists, indigenous healers, contemplative technologists. Many participants bridge multiple threads.
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 4: The Shape */}
      <Section className="bg-forest text-parchment relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 border border-sand rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[40rem] h-[40rem] border border-sand/40 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInWhenVisible className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Two weeks. One question. Many answers.</h2>
            <p className="text-xl md:text-2xl text-sand/80 font-light leading-relaxed">
              We gather in the quiet edges of nature to listen for what is truly needed next.
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="flex gap-4">
              <Calendar className="w-8 h-8 text-terracotta shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-2">When</h4>
                <p className="text-sand/70">May 2025</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-8 h-8 text-terracotta shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-2">Where</h4>
                <p className="text-sand/70">Nature-adjacent retreat center (Location TBA)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-8 h-8 text-terracotta shrink-0" />
              <div>
                <h4 className="font-serif text-xl mb-2">Who</h4>
                <p className="text-sand/70">~30 high-integrity leaders across the threads</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <FadeInWhenVisible>
              <h3 className="text-2xl font-serif text-sand mb-4 uppercase tracking-wider">Week One: Stillness</h3>
              <p className="text-lg text-sand/60 leading-relaxed italic">
                Arrival, decompression, silence, embodiment. Letting the nervous system settle. Swimming, sauna, movement, stillness. Finding the ground before the flight.
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
              <h3 className="text-2xl font-serif text-sand mb-4 uppercase tracking-wider">Week Two: Emergence</h3>
              <p className="text-lg text-sand/60 leading-relaxed italic">
                Ideas surfacing from a grounded place. Collaboration finding its natural form. Concrete plans taking shape. A handful of funded projects emerge, ready to begin.
              </p>
            </FadeInWhenVisible>
          </div>
        </div>
      </Section>

      {/* Section 5: The Commitment */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-terracotta flex-grow"></div>
              <h2 className="text-3xl md:text-4xl font-serif text-ink shrink-0">A focused commitment.</h2>
              <div className="h-px bg-terracotta flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="p-8 border border-sand/40 rounded-xl bg-sand/5">
                <h3 className="text-2xl font-serif text-forest mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-terracotta" /> Presence
                </h3>
                <p className="text-ink/70 leading-relaxed text-lg">
                  Full participation for two weeks. We require your complete attention, creating a sanctuary from the pull of external screens and daily distractions.
                </p>
              </div>
              <div className="p-8 border border-sand/40 rounded-xl bg-sand/5">
                <h3 className="text-2xl font-serif text-forest mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-terracotta" /> Availability
                </h3>
                <p className="text-ink/70 leading-relaxed text-lg">
                  Readiness to commit the next two years to what emerges. If a project captures you, you're in. We are here to build real things.
                </p>
              </div>
            </div>

            <p className="mt-12 text-center text-xl text-ink/80 italic">
              "Funding is ready for the most promising initiatives. We discover what wants to be built when the right people are truly present together."
            </p>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 6: AI Safety */}
      <Section className="bg-sand/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <FadeInWhenVisible className="md:w-1/3">
            <div className="relative">
              <div className="w-full aspect-square bg-forest rounded-full flex items-center justify-center relative overflow-hidden">
                <Flame className="w-32 h-32 text-terracotta animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-forest to-transparent opacity-50"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-terracotta text-white px-4 py-2 rounded-full font-serif italic text-sm shadow-lg">
                May 2025
              </div>
            </div>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible className="md:w-2/3">
            <h2 className="text-4xl font-serif text-forest mb-6">The first cocoon: AI Safety</h2>
            <div className="text-lg leading-relaxed text-ink/80 space-y-4">
              <p>
                Artificial intelligence is developing faster than our collective wisdom can guide it. The first <strong className="font-serif italic">now what?</strong> cocoon gathers those working at this frontier.
              </p>
              <p>
                We bring technologists, ethicists, artists, and indigenous wisdom keepers to define what aligned AI looks like and build the tools to steer toward it.
              </p>
              <p className="font-medium text-forest">
                A unique crucible for new approaches to artificial intelligence.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 7: Call to Action / Footer */}
      <Section className="pb-12 text-center">
        <FadeInWhenVisible>
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-sand/40 shadow-2xl relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-forest text-parchment p-3 rounded-full">
              <Mail className="w-6 h-6" />
            </div>
            
            <h2 className="text-4xl font-serif text-forest mb-4">Interested?</h2>
            <p className="text-ink/60 mb-8 text-lg">
              Applications open early 2025. Leave your email to be notified when the call for seekers begins.
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
            
            <p className="mt-8 text-sm text-ink/40">
              Tell us who you are and why this calls to you.
            </p>
          </div>
        </FadeInWhenVisible>

        <footer className="mt-24 pt-12 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-6 text-ink/40 text-sm">
          <div className="font-serif text-lg tracking-tight text-forest/60 uppercase">now what? 2025</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-terracotta transition-colors">Instagram</a>
            <a href="#" className="hover:text-terracotta transition-colors">Substack</a>
            <a href="mailto:hello@nowwhat.retreat" className="hover:text-terracotta transition-colors">hello@nowwhat.retreat</a>
          </div>
          <div className="italic font-cursive text-base">Emergence through Stillness.</div>
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
