
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import EnsoCircle from './EnsoCircle';

const JourneySection: React.FC = () => {
  const scrollToAudio = () => {
    const audioEl = document.getElementById('audio');
    if (audioEl) {
      audioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-20">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        <div className="flex justify-center order-2 lg:order-1">
          <EnsoCircle />
        </div>

        <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-xl mx-auto lg:mx-0"
          >
            <p className="text-purple-500 font-sans text-sm tracking-widest uppercase mb-4">The <em className="italic">Now What</em> Alchemizer</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
              We gather inspired, motivated people, and create the conditions where unexpected ideas emerge naturally.
            </h2>
            <p className="text-base md:text-lg text-gray-400 font-sans mb-4 leading-relaxed">
              A container targeted at the world's most pressing and challenging problems, beginning with a journey of unteachable lessons.
            </p>
            <p className="text-lg md:text-xl text-gray-400 font-serif italic opacity-80">
              Whatever wants to be born: startups, movements, films, communities.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Continue button at bottom */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={scrollToAudio}
        className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors mt-12"
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
  );
};

export default JourneySection;
