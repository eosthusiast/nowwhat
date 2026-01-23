
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
            <p className="text-xl md:text-2xl font-serif leading-relaxed text-center md:text-left text-slate-600">
              You've heard this countless times before. It's the same old story: we're at a threshold. AI, climate, and collective incoherence are accelerating faster than our solutions. The old incentives aren't working. The standard approaches aren't aligned to what humanity actually needs.
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-purple-800 text-center md:text-left my-8">
              The question is: now what?
            </h2>
            <p className="text-xl md:text-2xl font-serif leading-relaxed text-center md:text-left">
              The answer lies in the alchemy of bringing people together who are ready to commit their next 2 years to solutions. Who have the courage to stand in their truth and who we support to build what emerges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Conditions for Alchemy */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">The Conditions for Alchemy</h2>
            <p className="text-xl text-slate-600 italic font-serif">We create five essential conditions that make the extraordinary inevitable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                id: 1,
                title: "Unlikely Combinations",
                subtitle: "Cross-sector collisions that spark the new",
                content: "What happens when a technologist meets an indigenous wisdom keeper? When a filmmaker collaborates with a consciousness researcher? We bring together people from radically different worlds and create the conditions for these sparks to linger."
              },
              {
                id: 2,
                title: "Resourced from the Start",
                subtitle: "Remove every obstacle to creation",
                content: "Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion. We provide immediate funding, infrastructure, time, space, and remove the logistical friction."
              },
              {
                id: 3,
                title: "Fertile Soil",
                subtitle: "The ground from which emergence happens",
                content: "A process that unveils what's actually there. A mystery school of sorts. Beyond the basics of time spent free from distractions, and inclusive of all of your parts."
              },
              {
                id: 4,
                title: "Readiness",
                subtitle: "Presence and commitment to what emerges",
                content: "You're available to commit your next 2 years to steer a course to positive change. You get connected with allies who are as ready as you are."
              },
              {
                id: 5,
                title: "Domain Expertise",
                subtitle: "Wisdom from those who've walked the path",
                content: "Each event brings domain experts who are there to provide scaffolding, nuanced understanding and mentorship. These are the people who are actively solving the problems you're stepping into, and know the terrain and how to tread it."
              }
            ].map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: item.id % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-10 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-purple-700 font-bold mb-4 block">0{item.id}.</span>
                <h3 className="text-3xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-purple-800 font-medium mb-6 text-sm uppercase tracking-widest">{item.subtitle}</p>
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
              You're proud of what you created in the past. You've left a meaningful mark on people. You know deep in your bones that something's amiss. You feel the need to do things differently. You're standing at an empty page, asking "now what?"
            </p>
            <p className="text-xl text-slate-600 leading-relaxed">
              The answer lies outside your usual circles.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Implementers", desc: "Builders & Entrepreneurs", icon: Cpu },
              { title: "Artists", desc: "Storytellers, Musicians & Creators", icon: Palette },
              { title: "Stewards", desc: "Wisdom Keepers", icon: Leaf },
              { title: "Alchemists", desc: "Space Holders, Relational Adepts", icon: Sparkles }
            ].map((thread) => {
              const Icon = thread.icon;
              return (
                <div key={thread.title} className="text-center p-6 border-l border-slate-100 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-purple-700 mb-2">
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

      {/* 4. Leadup + CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          {/* Leadup to final "now what" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-serif text-slate-600 leading-relaxed">
              You've made it this far...
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic text-purple-800">
              what now?
            </h2>
          </motion.div>

          {/* CTA Box */}
          <div className="p-12 border border-slate-200 rounded-3xl bg-white/50 backdrop-blur-sm space-y-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900">Want to hear more?</h3>
            <p className="text-slate-500">Applications open early 2026. Leave your email to be notified.</p>

            <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-8 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all"
              />
              <button className="bg-purple-800 hover:bg-purple-700 text-white rounded-full px-8 py-4 font-bold flex items-center justify-center gap-2 transition-all group">
                Notify Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Rilke quote */}
          <blockquote className="max-w-2xl mx-auto italic text-slate-500 font-serif text-lg">
            "Be patient toward all that is unsolved in your heart and try to love the questions themselves." — Rilke
          </blockquote>
        </div>
      </section>

      {/* Footer - Light Theme */}
      <footer className="py-20 px-6">
        <div className="max-w-6xl mx-auto border-t border-slate-200 pt-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
            <h4 className="text-2xl font-serif font-bold text-slate-900">Now What Alchemizer 2026</h4>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-purple-800 transition-colors"><Instagram /></a>
              <a href="#" className="text-slate-400 hover:text-purple-800 transition-colors"><MessageCircle /></a>
              <a href="mailto:hello@nowwhatalchemizer.com" className="text-slate-400 hover:text-purple-800 transition-colors"><Mail /></a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Built with intention • All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Descent;
