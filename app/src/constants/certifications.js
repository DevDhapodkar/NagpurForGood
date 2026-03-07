import { FileText, Award, Shield, BadgeCheck } from 'lucide-react';

export const CERTIFICATION_CONFIG = {
    '80G': {
        label: '80G',
        icon: FileText,
        colors: {
            bg: 'bg-[#10b98110]',
            bgHover: 'hover:bg-[#10b98120]',
            bgSubtle: 'bg-[#10b98115]',
            border: 'border-[#10b98130]',
            text: 'text-[#10b981]',
            shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]'
        }
    },
    '12A': {
        label: '12A',
        icon: Award,
        colors: {
            bg: 'bg-[#f59e0b10]',
            bgHover: 'hover:bg-[#f59e0b20]',
            bgSubtle: 'bg-[#f59e0b15]',
            border: 'border-[#f59e0b30]',
            text: 'text-[#f59e0b]',
            shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]'
        }
    },
    'NITI Aayog': {
        label: 'NITI Aayog',
        icon: Shield,
        colors: {
            bg: 'bg-[#3b82f610]',
            bgHover: 'hover:bg-[#3b82f620]',
            bgSubtle: 'bg-[#3b82f615]',
            border: 'border-[#3b82f630]',
            text: 'text-[#3b82f6]',
            shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]'
        }
    },
    'NGO Darpan': {
        label: 'NGO Darpan',
        icon: BadgeCheck,
        colors: {
            bg: 'bg-[#a855f710]',
            bgHover: 'hover:bg-[#a855f720]',
            bgSubtle: 'bg-[#a855f715]',
            border: 'border-[#a855f730]',
            text: 'text-[#a855f7]',
            shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.1)]'
        }
    },
    'default': {
        label: 'Verified',
        icon: BadgeCheck,
        colors: {
            bg: 'bg-emerald-500/10',
            bgHover: 'hover:bg-emerald-500/20',
            bgSubtle: 'bg-emerald-500/15',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]'
        }
    }
};

export const getCertConfig = (certName) => {
    if (typeof certName !== 'string') return CERTIFICATION_CONFIG.default;
    
    const normalized = certName.toUpperCase();
    if (normalized.includes('80G')) return CERTIFICATION_CONFIG['80G'];
    if (normalized.includes('12A')) return CERTIFICATION_CONFIG['12A'];
    if (normalized.includes('NITI') || normalized.includes('AAYOG')) return CERTIFICATION_CONFIG['NITI Aayog'];
    if (normalized.includes('DARPAN')) return CERTIFICATION_CONFIG['NGO Darpan'];
    
    return {
        ...CERTIFICATION_CONFIG.default,
        label: certName
    };
};
