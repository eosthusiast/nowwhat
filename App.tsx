
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
          <p className="text-forest/90 font-medium text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed max-w-4xl mx-auto">
            Opening doors to radical possibility for those who shape the world.
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
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80 text-center md:text-left">
              <p>
                We gather inspired minds and create the conditions where unexpected collaborations naturally emerge.
              </p>
              <p className="text-xl md:text-2xl font-medium text-forest">
                Two weeks. The right people. Immediate funding.
              </p>
              <p className="italic text-terracotta">
                Whatever wants to be born: startups, movements, films, communities.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 3: The Convergence Moment */}
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

      {/* Section 4: The Alchemy of Unlikely Combinations */}
      <Section className="bg-sand/10">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight">
              The Alchemy of Unlikely Combinations
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80">
              <p>
                What happens when a technologist meets an indigenous knowledge keeper? When a filmmaker collaborates with a consciousness researcher? When a community organizer partners with a systems builder?
              </p>
              <p>
                We create the conditions for these meetings to matter.
              </p>
              <p className="text-2xl font-medium text-forest">
                Then we do the unusual: we remove every obstacle to building together. And we mean obstacles on all different levels:
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-lg text-ink/80">
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>Funding</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>Infrastructure</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>Time</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>Space</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>Access to collaborators outside your world</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>The logistical friction that kills momentum</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>The institutional barriers that separate sectors</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>The scarcity thinking that makes collaboration feel competitive</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span>The permission structure that says you need to prove it before you can build it</span>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 5: We Make It Effortless */}
      <Section className="bg-white/50">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight">
              We Make It Effortless
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-ink/80">
              <p>
                Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion.
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <h3 className="text-2xl md:text-3xl font-serif text-forest mt-12 mb-6">
              You get:
            </h3>
            <p className="text-lg leading-relaxed text-ink/80 mb-8">
              Connections you didn't know you needed. Time spent free from distractions and less caught up in the mind. A process that unveils what's actually there. Infrastructure to build immediately. Funding to make it real.
            </p>
            <p className="text-xl font-medium text-forest mt-8">
              We create the conditions. You bring the vision. We make building it possible.
            </p>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 6: The Shape */}
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

      {/* Section 7: A Different Set of Incentives */}
      <Section className="bg-sand/10">
        <div className="max-w-5xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-12 leading-tight text-center">
              A Different Set of Incentives
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-ink/50 mb-6">What most programs offer:</h3>
                <div className="space-y-3 text-lg text-ink/60">
                  <div className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Networking within your sector</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Frameworks for innovation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Pitch competitions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Deferred funding (maybe)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1">•</span>
                    <span>Go home and try to make it happen alone</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-l-4 border-terracotta pl-8">
                <h3 className="text-2xl font-serif text-forest mb-6">What Now What Alchemizer delivers:</h3>
                <div className="space-y-3 text-lg text-ink/80">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>Cross-sector collision of inspired minds</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>A process that unveils your clearest vision</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>Sparks of inspiration and kinship</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>Immediate funding, infrastructure and support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>Co-conspirators who become long-term collaborators</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                    <span>Better incentives: Joy fuels the work, rather than being its reward</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-12 text-center text-lg md:text-xl text-ink/80 leading-relaxed italic max-w-3xl mx-auto">
              We believe there's a moral responsibility in how we gather brilliant minds. We honor genius rather than extract it. We provide genuine abundance for building what matters.
            </p>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 8: Who This Is For */}
      <Section className="bg-white/50">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest mb-8 leading-tight">
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

      {/* Section 10: What Actually Happens */}
      <Section className="bg-forest text-parchment">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-tight">
              What Actually Happens
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-sand/90">
              <p>
                Two weeks. A carefully composed group. A location that matters. Everything you need to build, already in place.
              </p>
              <p>
                The collaborations that form are alchemical and bridge worlds. The solutions that arise feel obvious in hindsight, difficult to predict beforehand.
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible>
            <h3 className="text-2xl md:text-3xl font-serif mt-12 mb-6">
              By the end you'll have:
            </h3>
            <div className="space-y-3 text-lg text-sand/80">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                <span>Kinship with co-creators</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                <span>Funding</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                <span>Infrastructure</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta mt-1 shrink-0" />
                <span>Sustained momentum</span>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </Section>

      {/* Section 11: The Vision */}
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

        <footer className="mt-24 pt-12 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-6 text-ink/40 text-sm">
          <div className="font-serif text-lg tracking-tight text-forest/60">Now What Alchemizer 2025</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-terracotta transition-colors">Instagram</a>
            <a href="#" className="hover:text-terracotta transition-colors">Substack</a>
            <a href="mailto:hello@nowwhatalchemizer.com" className="hover:text-terracotta transition-colors">hello@nowwhatalchemizer.com</a>
          </div>
          <div className="italic text-base text-ink/50">Drawing on consciousness research and the moral responsibility of gathering brilliant minds ethically.</div>
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
