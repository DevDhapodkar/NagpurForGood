import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NGODetails from './pages/NGODetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import NGODashboard from './pages/NGODashboard';
import WelcomeNGO from './pages/WelcomeNGO';
import Mission from './pages/Mission';
import Directory from './pages/Directory';
import Impact from './pages/Impact';
import RegisterNGO from './pages/RegisterNGO';
import TrustScoreInfo from './pages/TrustScoreInfo';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NGOProvider } from './context/NGOContext';
import { ToastProvider } from './context/ToastContext';

function App() {
    const [theme, setTheme] = React.useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    React.useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <AuthProvider>
            <NGOProvider>
                <ToastProvider>
                    <Router>
                <div className="min-h-screen font-sans selection:bg-amber-500/30 flex flex-col">
                    <Navbar theme={theme} toggleTheme={toggleTheme} />

                    <div className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/ngo/:id" element={<NGODetails />} />
                            <Route path="/mission" element={<Mission />} />
                            <Route path="/directory" element={<Directory />} />
                            <Route path="/impact" element={<Impact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/register-ngo" element={<RegisterNGO />} />
                            <Route path="/apply" element={<RegisterNGO />} />
                            <Route path="/trust-score" element={<TrustScoreInfo />} />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute requireAdmin={true}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/welcome" element={<WelcomeNGO />} />
                            <Route 
                                path="/ngo-dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <NGODashboard />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </div>

                    {/* Global Footer */}
                    <footer className="relative z-10 w-full border-t border-theme-primary/10 glass-panel mt-auto pt-14 pb-8 px-6">
                        <div className="max-w-7xl mx-auto flex flex-col gap-12">

                            {/* Top Row: Logo + Copyright */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <img src="/logo.png" alt="NagpurGoodOrg Logo" className="h-16 sm:h-20 w-auto object-contain drop-shadow-md scale-125 origin-left" />
                                    <div>
                                        <div className="text-xl font-black text-theme-primary tracking-tighter font-serif">NagpurGoodOrg</div>
                                        <div className="text-[10px] uppercase tracking-widest text-theme-primary/40 font-black mt-[-2px]">Authentic Impact Hub</div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-2">
                                    <p className="text-theme-primary/40 text-[11px] uppercase tracking-widest font-black max-w-sm md:text-right">
                                        © 2026 Built for Nagpur. Verified.
                                    </p>
                                    <p className="text-theme-primary/20 text-[9px] uppercase tracking-widest font-medium">
                                        Data verified against NGO Darpan &amp; Official Portals
                                    </p>
                                </div>
                            </div>

                            {/* Association Section */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-theme-primary/30 font-black">Created in Association With</p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <span className="px-4 py-1.5 rounded-full border border-theme-primary/20 text-theme-primary/60 text-xs font-bold tracking-wide">
                                        🎓 Dr. Pradnya Borker — Mentor, Symbiosis Institute of Technology
                                    </span>
                                    <span className="text-theme-primary/20 text-xs">·</span>
                                    <span className="px-4 py-1.5 rounded-full border border-theme-primary/20 text-theme-primary/60 text-xs font-bold tracking-wide">
                                        🎓 Dr. Ramdas Khomane — Mentor, Symbiosis Institute of Technology
                                    </span>
                                    <span className="text-theme-primary/20 text-xs">·</span>
                                    <span className="px-4 py-1.5 rounded-full border border-theme-primary/20 text-theme-primary/60 text-xs font-bold tracking-wide">
                                        🤝 Five Fold Maitri Society
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-theme-primary/10" />

                            {/* Our Team Section */}
                            <div className="flex flex-col items-center gap-6">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-theme-primary/30 font-black">Our Team</p>
                                <div className="flex flex-wrap items-center justify-center gap-8">
                                    {[
                                        { name: 'Anshuman Padole', img: '/team/anshuman.jpg' },
                                        { name: 'Harsh Manmode', img: '/team/harsh.jpg' },
                                        { name: 'Rudrani Ullewar', img: '/team/rudrani.jpg' },
                                        { name: 'Sidharth Pimpalkar', img: '/team/sidharth.jpg' },
                                        { name: 'Tanmay Kalinkar', img: '/team/tanmay.jpg' },
                                        { name: 'Dev Dilip Dhapodkar', img: '/team/dev.jpg' },
                                    ].map((member) => (
                                        <div key={member.name} className="flex flex-col items-center gap-2 group">
                                            <div style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '2px solid rgba(var(--color-theme-primary-rgb, 0,0,0), 0.15)',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.10)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
                                            >
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-semibold text-theme-primary/50 tracking-wide text-center max-w-[80px] leading-tight">
                                                {member.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </footer>
            </div>
        </Router>
        </ToastProvider>
        </NGOProvider>
    </AuthProvider>
    );
}

export default App;
