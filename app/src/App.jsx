import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NGODetails from './pages/NGODetails';

function App() {
    return (
        <Router>
            <div className="min-h-screen font-sans selection:bg-pink-500/30 bg-[#09090b]">
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ngo/:id" element={<NGODetails />} />
                </Routes>

                {/* Global Footer */}
                <footer className="relative z-10 w-full border-t border-white/10 glass-panel mt-20 py-16 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-black text-lg shadow-lg">N</div>
                            <div>
                                <div className="text-xl font-black text-white tracking-tighter uppercase">Nagpur For Good</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40 font-black mt-[-2px]">Authentic Impact Hub</div>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                            <p className="text-white/40 text-[11px] uppercase tracking-widest font-black max-w-sm md:text-right">
                                © 2026 Built for Nagpur. Verified and Open Source.
                            </p>
                            <p className="text-white/20 text-[9px] uppercase tracking-widest font-medium">
                                Data verified against NGO Darpan & Official Portals
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
