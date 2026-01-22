
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Instagram, MessageCircle, Cpu, Palette, Leaf, Sparkles } from 'lucide-react';

const Descent: React.FC = () => {
  return (
    <div className="bg-[#f7f5f0] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      {/* 1. The Convergence Moment */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-serif leading-tight text-center md:text-left">
              We're at a threshold. AI, climate, and collective incoherence are accelerating faster than our solutions. 
              The old incentives aren't working. The standard approaches aren't aligned to what humanity actually needs.
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-indigo-600 text-center md:text-left">
              The question is: now what?
            </h2>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto md:mx-0 leading-relaxed text-center md:text-left">
              The answer isn't found by adding more frameworks or strategies. It's revealed when you bring the right people together, remove what obstructs their natural brilliance, and make it effortless to build what emerges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Conditions for Alchemy */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">The Conditions for Alchemy</h2>
            <p className="text-xl text-slate-600 italic font-serif">We create four essential conditions that make the extraordinary inevitable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                id: 1,
                title: "Unlikely Combinations",
                subtitle: "Cross-sector collisions that spark the new",
                content: "What happens when a technologist meets an indigenous knowledge keeper? When a filmmaker collaborates with a consciousness researcher? We bring together people from radically different worlds and create the conditions for these meetings to matter."
              },
              {
                id: 2,
                title: "Effortless Building",
                subtitle: "Remove every obstacle to creation",
                content: "Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion. We provide immediate funding, infrastructure, time, space, and remove the logistical friction."
              },
              {
                id: 3,
                title: "Fertile Soil",
                subtitle: "The ground from which emergence happens",
                content: "Time spent free from distractions and less caught up in the mind. A process that unveils what's actually there. Swimming, sauna, silence, embodiment. We don't prescribe the form—we create the conditions."
              },
              {
                id: 4,
                title: "Available People",
                subtitle: "Presence and commitment to what emerges",
                content: "You're here fully. Two weeks of complete presence. And you're available to commit your next 2 years to row this boat with allies from completely different worlds."
              }
            ].map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: item.id % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-10 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-indigo-500 font-bold mb-4 block">0{item.id}.</span>
                <h3 className="text-3xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-indigo-600 font-medium mb-6 text-sm uppercase tracking-widest">{item.subtitle}</p>
                <p className="text-slate-600 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who This Is For & Threads */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-32">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-serif font-bold">Who This Is For</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              You touched people in meaningful ways. You have created amazing things. You viscerally feel that something's amiss.
              You're standing at an empty page, asking "now what?" The answer lies outside your usual circles.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Implementers", desc: "Builders & Entrepreneurs", icon: Cpu },
              { title: "Artists", desc: "Storytellers & Creators", icon: Palette },
              { title: "Stewards", desc: "Wisdom Keepers", icon: Leaf },
              { title: "Alchemists", desc: "Space Holders", icon: Sparkles }
            ].map((thread) => {
              const Icon = thread.icon;
              return (
                <div key={thread.title} className="text-center p-6 border-l border-slate-100 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-indigo-500 mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold leading-tight">{thread.title}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest leading-relaxed">{thread.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CTA Section - Light Theme */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="p-12 border border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm space-y-8">
            <h3 className="text-4xl font-serif font-bold text-slate-900">Ready to begin?</h3>
            <p className="text-slate-500">Applications open early 2026. Leave your email to be notified.</p>

            <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-8 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-4 font-bold flex items-center justify-center gap-2 transition-all group">
                Notify Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <blockquote className="max-w-2xl mx-auto pt-20 border-t border-slate-200 italic text-slate-500 font-serif text-xl">
            "We funded a collaboration between a quantum physicist and a Sufi poet. They're building something that shouldn't exist according to conventional categories. It's working."
          </blockquote>
        </div>
      </section>

      {/* 5. Now What - Final Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-indigo-600"
          >
            now what?
          </motion.h2>
        </div>
      </section>

      {/* Footer - Light Theme */}
      <footer className="py-20 px-6">
        <div className="max-w-6xl mx-auto border-t border-slate-200 pt-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
            <h4 className="text-2xl font-serif font-bold text-slate-900">Now What Alchemizer 2026</h4>
            <p className="text-slate-500 text-sm max-w-xs">
              "Be patient toward all that is unsolved in your heart and try to love the questions themselves." — Rilke
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Instagram /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><MessageCircle /></a>
              <a href="mailto:hello@nowwhatalchemizer.com" className="text-slate-400 hover:text-indigo-600 transition-colors"><Mail /></a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Built with intention • All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Descent;
