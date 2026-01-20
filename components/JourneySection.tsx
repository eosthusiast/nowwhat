
import React from 'react';
import { motion } from 'framer-motion';
import EnsoCircle from './EnsoCircle';

const JourneySection: React.FC = () => {
  return (
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
          <p className="text-indigo-300 font-sans text-sm tracking-widest uppercase mb-4">The Container</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
            We gather inspired people and create the conditions where unexpected ideas emerge naturally.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-serif italic opacity-80">
            Whatever wants to be born: startups, movements, films, communities.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JourneySection;
