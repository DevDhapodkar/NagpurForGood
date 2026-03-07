import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass-btn flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <Sun size={20} className="text-amber-400 fill-amber-400/20 transition-transform duration-500 group-hover:rotate-45" />
                ) : (
                    <Moon size={20} className="text-violet-600 fill-violet-600/20 transition-transform duration-500 group-hover:-rotate-12" />
                )}
            </div>
            
            {/* Subtle glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${theme === 'dark' ? 'bg-amber-400/20' : 'bg-violet-600/20'}`} />
        </button>
    );
};

export default ThemeToggle;
