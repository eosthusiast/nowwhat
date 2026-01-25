
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FontOption {
  name: string;
  family: string;
  category: string;
}

const FONT_OPTIONS: FontOption[] = [
  // Sleek
  { name: 'Inter', family: "'Inter', sans-serif", category: 'Sleek' },
  { name: 'DM Sans', family: "'DM Sans', sans-serif", category: 'Sleek' },
  { name: 'Outfit', family: "'Outfit', sans-serif", category: 'Sleek' },
  { name: 'Sora', family: "'Sora', sans-serif", category: 'Sleek' },
  { name: 'Manrope', family: "'Manrope', sans-serif", category: 'Sleek' },
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'Sleek' },

  // Professional
  { name: 'Source Sans 3', family: "'Source Sans 3', sans-serif", category: 'Professional' },
  { name: 'IBM Plex Sans', family: "'IBM Plex Sans', sans-serif", category: 'Professional' },
  { name: 'Work Sans', family: "'Work Sans', sans-serif", category: 'Professional' },
  { name: 'Nunito Sans', family: "'Nunito Sans', sans-serif", category: 'Professional' },
  { name: 'Lato', family: "'Lato', sans-serif", category: 'Professional' },

  // Magical
  { name: 'Quicksand', family: "'Quicksand', sans-serif", category: 'Magical' },
  { name: 'Comfortaa', family: "'Comfortaa', sans-serif", category: 'Magical' },
  { name: 'Josefin Sans', family: "'Josefin Sans', sans-serif", category: 'Magical' },
  { name: 'Fredoka', family: "'Fredoka', sans-serif", category: 'Magical' },
  { name: 'Varela Round', family: "'Varela Round', sans-serif", category: 'Magical' },

  // Mystical
  { name: 'Philosopher', family: "'Philosopher', sans-serif", category: 'Mystical' },
  { name: 'Jost', family: "'Jost', sans-serif", category: 'Mystical' },
  { name: 'Poiret One', family: "'Poiret One', sans-serif", category: 'Mystical' },
  { name: 'Tenor Sans', family: "'Tenor Sans', sans-serif", category: 'Mystical' },

  // Futuristic
  { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'Futuristic' },
  { name: 'Orbitron', family: "'Orbitron', sans-serif", category: 'Futuristic' },
  { name: 'Exo 2', family: "'Exo 2', sans-serif", category: 'Futuristic' },
  { name: 'Rajdhani', family: "'Rajdhani', sans-serif", category: 'Futuristic' },
  { name: 'Audiowide', family: "'Audiowide', sans-serif", category: 'Futuristic' },
];

const CATEGORIES = ['Sleek', 'Professional', 'Magical', 'Mystical', 'Futuristic'];

const FontPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load saved font on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedFont');
    if (saved) {
      const index = FONT_OPTIONS.findIndex(f => f.name === saved);
      if (index !== -1) {
        setCurrentIndex(index);
        applyFont(FONT_OPTIONS[index]);
      }
    }
  }, []);

  const applyFont = useCallback((font: FontOption) => {
    // Update CSS custom property for .font-sans
    const styleEl = document.getElementById('font-picker-style') || document.createElement('style');
    styleEl.id = 'font-picker-style';
    styleEl.textContent = `.font-sans { font-family: ${font.family} !important; }`;
    if (!document.getElementById('font-picker-style')) {
      document.head.appendChild(styleEl);
    }
    localStorage.setItem('selectedFont', font.name);
  }, []);

  const selectFont = useCallback((index: number) => {
    setCurrentIndex(index);
    applyFont(FONT_OPTIONS[index]);
  }, [applyFont]);

  const cycleFont = useCallback((direction: 1 | -1) => {
    const filteredFonts = selectedCategory
      ? FONT_OPTIONS.filter(f => f.category === selectedCategory)
      : FONT_OPTIONS;

    const currentFont = FONT_OPTIONS[currentIndex];
    const currentFilteredIndex = filteredFonts.findIndex(f => f.name === currentFont.name);

    let newFilteredIndex = currentFilteredIndex + direction;
    if (newFilteredIndex < 0) newFilteredIndex = filteredFonts.length - 1;
    if (newFilteredIndex >= filteredFonts.length) newFilteredIndex = 0;

    const newFont = filteredFonts[newFilteredIndex];
    const newGlobalIndex = FONT_OPTIONS.findIndex(f => f.name === newFont.name);

    selectFont(newGlobalIndex);
  }, [currentIndex, selectedCategory, selectFont]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+F to toggle panel
      if (e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Arrow keys to cycle fonts (only when panel is open)
      if (isOpen) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          cycleFont(-1);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          cycleFont(1);
        } else if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cycleFont]);

  const currentFont = FONT_OPTIONS[currentIndex];
  const filteredFonts = selectedCategory
    ? FONT_OPTIONS.filter(f => f.category === selectedCategory)
    : FONT_OPTIONS;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-purple-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-purple-700/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Font Picker (Shift+F)"
      >
        <Type className="w-5 h-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-20 left-4 z-50 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-purple-700/30 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-purple-700/20 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm">Font Picker</h3>
                <p className="text-purple-400/60 text-xs">Use arrow keys to cycle</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Font Display */}
            <div className="px-4 py-4 border-b border-purple-700/20 bg-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => cycleFont(-1)}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <div className="text-center flex-1">
                  <p
                    className="text-2xl text-white mb-1"
                    style={{ fontFamily: currentFont.family }}
                  >
                    {currentFont.name}
                  </p>
                  <p className="text-xs text-purple-400/60">{currentFont.category}</p>
                </div>
                <button
                  onClick={() => cycleFont(1)}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Text */}
              <p
                className="text-sm text-white/70 text-center mt-3"
                style={{ fontFamily: currentFont.family }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            {/* Category Filter */}
            <div className="px-3 py-2 border-b border-purple-700/20 flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Font List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredFonts.map((font) => {
                const globalIndex = FONT_OPTIONS.findIndex(f => f.name === font.name);
                const isSelected = globalIndex === currentIndex;
                return (
                  <button
                    key={font.name}
                    onClick={() => selectFont(globalIndex)}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-purple-600/30 text-white'
                        : 'text-white/70 hover:bg-purple-900/30'
                    }`}
                    style={{ fontFamily: font.family }}
                  >
                    <span className="text-sm">{font.name}</span>
                    <span className="text-[10px] text-purple-400/50 uppercase">{font.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            <div className="px-4 py-2 border-t border-purple-700/20">
              <button
                onClick={() => selectFont(0)}
                className="w-full py-2 text-xs text-purple-400/60 hover:text-purple-400 transition-colors uppercase tracking-wider"
              >
                Reset to Inter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FontPicker;
