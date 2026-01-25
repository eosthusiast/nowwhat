
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Instagram, MessageCircle, Cpu, Palette, Leaf, Sparkles, ChevronDown, Calendar, MapPin, DollarSign, ArrowUp } from 'lucide-react';

const Descent: React.FC = () => {
  const [showWhatNow, setShowWhatNow] = useState(false);
  const [convergenceStep, setConvergenceStep] = useState(0); // 0: nothing, 1: problem, 2: question, 3: answer
  const [problemStep, setProblemStep] = useState(0); // 0-6: staged reveal of problem items
  const [questionStep, setQuestionStep] = useState(0); // 0-2: staged reveal of question
  const [answerStep, setAnswerStep] = useState(0); // 0: nothing, 1: "together", 2: "at the right time", 3: "in the right way", 4: "antidote"
  const [sectionInView, setSectionInView] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const problemTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle sequential reveal for convergence section
  useEffect(() => {
    if (sectionInView && convergenceStep < 3) {
      // For step 1→2: wait until problem is fully revealed (problemStep >= 6), then 1.5s
      if (convergenceStep === 1 && problemStep < 6) {
        return; // Wait for problem to finish revealing
      }

      // For step 2→3: wait until question is fully revealed (questionStep >= 2), then 1.5s
      if (convergenceStep === 2 && questionStep < 2) {
        return; // Wait for question to finish revealing
      }

      const delay = convergenceStep === 1 ? 1500 : // 1.5s after "you name it"
                    convergenceStep === 2 ? 3000 : // 3s after "now what?"
                    4000;

      timerRef.current = setTimeout(() => {
        setConvergenceStep(prev => prev + 1);
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sectionInView, convergenceStep, problemStep, questionStep]);

  // Handle staged reveal for the problem sentence
  useEffect(() => {
    if (convergenceStep >= 1 && problemStep < 6) {
      // Step 1→2 (when "AI" appears) has 1s extra delay
      const delay = problemStep === 0 ? 0 : problemStep === 1 ? 2500 : 1500;
      problemTimerRef.current = setTimeout(() => {
        setProblemStep(prev => prev + 1);
      }, delay);
    }
    return () => {
      if (problemTimerRef.current) clearTimeout(problemTimerRef.current);
    };
  }, [convergenceStep, problemStep]);

  // Handle staged reveal for the question sentence
  useEffect(() => {
    if (convergenceStep >= 2 && questionStep < 2) {
      questionTimerRef.current = setTimeout(() => {
        setQuestionStep(prev => prev + 1);
      }, questionStep === 0 ? 0 : 1500); // First part immediately, then 1.5s delay
    }
    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, [convergenceStep, questionStep]);

  // Handle staged reveal for the answer sentence
  useEffect(() => {
    if (convergenceStep === 3 && answerStep < 4) {
      answerTimerRef.current = setTimeout(() => {
        setAnswerStep(prev => prev + 1);
      }, answerStep === 0 ? 0 : 1500); // First part immediately, then 1.5s delays
    }
    return () => {
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, [convergenceStep, answerStep]);

  const handleConvergenceClick = () => {
    // Sequential advancement: problem → question → answer
    if (convergenceStep >= 1 && problemStep < 6) {
      // Still revealing problem - advance problem
      if (problemTimerRef.current) clearTimeout(problemTimerRef.current);
      setProblemStep(prev => prev + 1);
    } else if (convergenceStep < 2) {
      // Problem done, trigger question phase
      if (timerRef.current) clearTimeout(timerRef.current);
      setConvergenceStep(2);
    } else if (convergenceStep >= 2 && questionStep < 2) {
      // Still revealing question - advance question
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
      setQuestionStep(prev => prev + 1);
    } else if (convergenceStep < 3) {
      // Question done, trigger answer phase
      if (timerRef.current) clearTimeout(timerRef.current);
      setConvergenceStep(3);
    } else if (convergenceStep === 3 && answerStep < 4) {
      // Still revealing answer - advance answer
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
      setAnswerStep(prev => prev + 1);
    }
  };

  const scrollToWhoFor = () => {
    document.getElementById('who-for')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToConditions = () => {
    document.getElementById('conditions')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCTA = () => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEventDetails = () => {
    document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTeam = () => {
    document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAEADD] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      {/* 1. The Convergence Moment */}
      <motion.section
        className="min-h-screen flex flex-col items-center justify-center px-6 py-32 border-b border-slate-100 bg-[#FFFBF5] cursor-pointer relative"
        onClick={handleConvergenceClick}
        onViewportEnter={() => {
          setSectionInView(true);
          if (convergenceStep === 0) setConvergenceStep(1);
        }}
        onViewportLeave={() => setSectionInView(false)}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-8">
            {/* Problem - always rendered for space, opacity controlled */}
            <p className="text-xl md:text-2xl font-serif leading-relaxed text-center md:text-left text-slate-600">
              <motion.span
                animate={{ opacity: problemStep >= 1 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                We all know what the problems are:
              </motion.span>
              <motion.span
                animate={{ opacity: problemStep >= 2 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}AI,
              </motion.span>
              <motion.span
                animate={{ opacity: problemStep >= 3 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}climate,
              </motion.span>
              <motion.span
                animate={{ opacity: problemStep >= 4 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}mental health crisis,
              </motion.span>
              <motion.span
                animate={{ opacity: problemStep >= 5 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}collective incoherence,
              </motion.span>
              <motion.span
                animate={{ opacity: problemStep >= 6 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}you name it…
              </motion.span>
            </p>

            {/* Question - always rendered for space, opacity controlled */}
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-purple-800 text-center md:text-left my-8">
              <motion.span
                animate={{ opacity: questionStep >= 1 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                The question is:
              </motion.span>
              <motion.span
                animate={{ opacity: questionStep >= 2 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}now what?
              </motion.span>
            </h2>

            {/* Answer - always rendered for space, opacity controlled */}
            <p className="text-2xl md:text-3xl font-serif leading-relaxed text-center md:text-left">
              <motion.span
                animate={{ opacity: answerStep >= 1 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                The answer lies in the alchemy of bringing the right people together
              </motion.span>
              <motion.span
                animate={{ opacity: answerStep >= 2 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}at the right time
              </motion.span>
              <motion.span
                animate={{ opacity: answerStep >= 3 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}in the right way.
              </motion.span>
              <motion.span
                animate={{ opacity: answerStep >= 4 ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {" "}This could be the antidote to the epidemic of helplessness.
              </motion.span>
            </p>
          </div>
        </div>

        {/* Continue button - positioned at bottom */}
        {answerStep >= 4 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            onClick={scrollToWhoFor}
            className="group flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors absolute bottom-12"
          >
            <span className="text-sm tracking-widest uppercase font-sans">Continue</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        )}
      </motion.section>

      {/* 2. Who This Is For & Threads */}
      <section id="who-for" className="py-32 px-6 bg-[#FAEADD]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-serif font-bold">Who This Is For</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              You're proud of what you created in the past. You've made a genuine difference in others' lives. You're ready right now and willing to pivot your life to meaningful projects that come up. You have the courage to stand in your truth. You know deep in your bones that something's amiss. You feel the need to do things differently. You're standing at an empty page, asking "now what?"
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
                  <div className="w-12 h-12 rounded-full bg-[#FEF6EE] flex items-center justify-center text-purple-700 mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold leading-tight">{thread.title}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest leading-relaxed">{thread.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={scrollToConditions}
            className="group flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mt-12 mx-auto"
          >
            <span className="text-sm tracking-widest uppercase font-sans">Continue</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* 3. The Conditions for Alchemy */}
      <section id="conditions" className="py-32 px-6 bg-[#FEF9F4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">The Conditions for Alchemy</h2>
            <p className="text-xl text-slate-600 italic font-serif">We create five essential conditions that make the extraordinary inevitable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                id: 1,
                title: "Surprising Collaborations",
                subtitle: "Cross-sector collisions that spark the new",
                content: "We learn so much through failure and diversity that leads to the most unpredictable outcomes. When we go about things differently with people you'd think have no overlap, we get something none of us could've dreamed up in our silos."
              },
              {
                id: 2,
                title: "Resourced from the Start",
                subtitle: "Remove every obstacle to creation",
                content: "Most gatherings end with inspiration and business cards. Ours end with funded collaborations already in motion. We provide immediate funding, infrastructure, time, space, and remove the logistical friction. We do the due diligence ourselves."
              },
              {
                id: 3,
                title: "Fertile Soil",
                subtitle: "The ground from which emergence happens",
                content: "A process that unveils what's actually there. A school of unteachable lessons, led by master experience designers. Beyond the basics of time spent free from distractions, and inclusive of all of your parts."
              },
              {
                id: 4,
                title: "Readiness and Capacity",
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
                className="p-10 bg-[#FFFDFB] border border-[#F0E6DD] rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-purple-700 font-bold mb-4 block">0{item.id}.</span>
                <h3 className="text-3xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-purple-800 font-medium mb-6 text-sm uppercase tracking-widest">{item.subtitle}</p>
                <p className="text-slate-600 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Text below the boxes */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-slate-500 italic font-serif mt-16 max-w-2xl mx-auto text-2xl"
          >
            If something doesn't feel totally clear, invite that in. We've given you as much as you need to know at this stage.
          </motion.p>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={scrollToEventDetails}
            className="group flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mt-16 mx-auto"
          >
            <span className="text-sm tracking-widest uppercase font-sans">Continue</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* 4. Event Details */}
      <section id="event-details" className="py-24 px-6 bg-[#FFFBF5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">Event Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "When", info: "To be disclosed", icon: Calendar },
              { title: "Where", info: "To be disclosed", icon: MapPin },
              { title: "Cost", info: "To be disclosed", icon: DollarSign },
              { title: "Theme", info: "To be disclosed", icon: Sparkles }
            ].map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.title} className="text-center p-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#FEF6EE] flex items-center justify-center text-purple-700">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold">{detail.title}</h4>
                  <p className="text-slate-500 italic">{detail.info}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-slate-600 mt-12 text-lg font-serif">
            Two weeks. Thirty people. One transformative experience.
          </p>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={scrollToCTA}
            className="group flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mt-12 mx-auto"
          >
            <span className="text-sm tracking-widest uppercase font-sans">Continue</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* 5. Leadup + CTA Section */}
      <section id="cta" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          {/* Leadup with animated flip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => {
              setShowWhatNow(false);
              setTimeout(() => setShowWhatNow(true), 3000);
            }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-serif text-slate-600 leading-relaxed">
              You've made it this far...
            </p>
            <div className="h-20 md:h-24 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {!showWhatNow ? (
                  <motion.h2
                    key="now-what"
                    initial={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl md:text-6xl font-serif font-bold italic text-purple-800"
                  >
                    now what?
                  </motion.h2>
                ) : (
                  <motion.h2
                    key="what-now"
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl md:text-6xl font-serif font-bold italic text-purple-800"
                  >
                    what now?
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA Box */}
          <div className="p-12 border border-[#F0E6DD] rounded-3xl bg-[#FFFDFB]/80 backdrop-blur-sm space-y-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900">Want to hear more?</h3>

            <form className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-[#FEF9F4] border border-[#F0E6DD] rounded-full px-8 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all"
              />
              <textarea
                placeholder="Your opportunity to leave a note..."
                rows={3}
                className="w-full bg-[#FEF9F4] border border-[#F0E6DD] rounded-2xl px-8 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all resize-none"
              />
              <button className="w-full md:w-auto bg-purple-800 hover:bg-purple-700 text-white rounded-full px-8 py-4 font-bold flex items-center justify-center gap-2 transition-all group mx-auto">
                Notify Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Continue to Team button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={scrollToTeam}
              className="group flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mt-8 mx-auto"
            >
              <span className="text-sm tracking-widest uppercase font-sans">Meet the Team</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </div>

          {/* Team Section */}
          <div id="team" className="pt-16 scroll-mt-16">
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-12">The Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Carolin Fleissner", bio: "Caro bridges embodied wisdom and technological innovation. Dance-trained and first hire at Wayve (AI/autonomous vehicles), she scaled the company from 1 to 220+ employees as VP of People & Culture, supporting $1.2B+ in fundraising. She now works as advisor, coach, and facilitator, running retreats and workshops that weave somatic practices with transformational leadership.", image: "/team/caro.jpeg" },
                { name: "Askja Michelle Rickenbach", bio: "Askja weaves leadership development with ecological wisdom. Trained in nature and wilderness pedagogy at Woniya Naturschule, she brings experience in social entrepreneurship, youth engagement, and international team management across Switzerland and beyond. Her work integrates somatic practices with organizational transformation, guiding groups to reconnect with natural rhythms while building regenerative systems and conscious communities.", image: "/team/askja.jpg" },
                { name: "Kaela Atleework", bio: "Kaela brings depth to human connection. Former international model for Chanel turned digital nomad and community architect, she's traveled 40+ countries facilitating workshops on \"instantaneous intimacy\" and regenerative living. Founder of Montaia, a global network of purpose-driven nomads and conscious creatives. Experience designer specializing in co-living experiments, authentic relating practices, and ecologically conscious gatherings that transform superficial networking into meaningful collaboration.", image: "/team/kaela.jpeg" },
                { name: "David Hera, PhD", bio: "David bridges mycology, technology, and transformational design. PhD in mycology studying indigenous mushrooms of Aotearoa New Zealand, former semiconductor applications manager across Asia and USA, with expertise in complex international coordination. Co-founder of Goodbye Monkey and co-creator of S.A.N (Sentient Advocate of Nature) art installation (Burning Man), photographer, and ecstatic dance DJ. Brings precision, reliability, and interdisciplinary thinking to transformational work.", image: "/team/David.jpg" }
              ].map((member) => (
                <div key={member.name} className="flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full bg-slate-200 overflow-hidden mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-center min-h-14 mb-4">{member.name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed text-left">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Margaret Mead quote */}
          <blockquote className="max-w-2xl mx-auto italic text-slate-500 font-serif text-lg">
            "Never doubt that a small group of thoughtful, committed, citizens can change the world. Indeed, it is the only thing that ever has." — Margaret Mead
          </blockquote>
        </div>
      </section>

      {/* Footer - Light Theme */}
      <footer className="py-20 px-6">
        <div className="max-w-6xl mx-auto border-t border-[#F0E6DD] pt-20 flex flex-col md:flex-row justify-between items-center gap-12">
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

        {/* Back to top */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -3 }}
          className="mx-auto mt-12 flex flex-col items-center gap-2 text-slate-400 hover:text-purple-800 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-widest">Back to top</span>
        </motion.button>
      </footer>
    </div>
  );
};

export default Descent;
