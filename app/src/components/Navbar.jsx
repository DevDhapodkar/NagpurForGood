import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 glass-panel py-4 px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
                            NfG
                        </span>
                    </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                    Nagpur For Good
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button className="glass-btn px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white transition-colors">
                    Suggest NGO
                </button>
                <button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all hover:scale-105 active:scale-95">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
