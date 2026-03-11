import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NGODetails from './pages/NGODetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    const [theme, setTheme] = React.useState(() => {
        return localStorage.getItem('theme') || 'dark';
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
            <Router>
                <div className="min-h-screen font-sans selection:bg-amber-500/30 flex flex-col">
                    <Navbar theme={theme} toggleTheme={toggleTheme} />

                    <div className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/ngo/:id" element={<NGODetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </div>

                    {/* Global Footer */}
                    <footer className="relative z-10 w-full border-t border-theme-primary/10 glass-panel mt-auto py-16 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <img src="/logo.png" alt="Nagpur Good Organisation Logo" className="h-16 sm:h-20 w-auto object-contain drop-shadow-md scale-125 origin-left" />
                            <div>
                                <div className="text-xl font-black text-theme-primary tracking-tighter font-serif">Nagpur Good Organisation</div>
                                <div className="text-[10px] uppercase tracking-widest text-theme-primary/40 font-black mt-[-2px]">Authentic Impact Hub</div>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                            <p className="text-theme-primary/40 text-[11px] uppercase tracking-widest font-black max-w-sm md:text-right">
                                © 2026 Built for Nagpur. Verified and Open Source.
                            </p>
                            <p className="text-theme-primary/20 text-[9px] uppercase tracking-widest font-medium">
                                Data verified against NGO Darpan & Official Portals
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    </AuthProvider>
    );
}

export default App;
