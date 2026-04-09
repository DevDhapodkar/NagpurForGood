import { FileText, Award, Shield, BadgeCheck } from 'lucide-react';

export const CERTIFICATION_CONFIG = {
    '80G': {
        label: '80G',
        icon: FileText,
        colors: {
            bg: 'bg-[#ef444410]', // red-500
            bgHover: 'hover:bg-[#ef444420]',
            bgSubtle: 'bg-[#ef444415]',
            border: 'border-[#ef444430]',
            text: 'text-[#ef4444]',
            shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]'
        }
    },
    '12A': {
        label: '12A',
        icon: Award,
        colors: {
            bg: 'bg-[#f9731610]', // orange-500
            bgHover: 'hover:bg-[#f9731620]',
            bgSubtle: 'bg-[#f9731615]',
            border: 'border-[#f9731630]',
            text: 'text-[#f97316]',
            shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.1)]'
        }
    },
    'NITI Aayog': {
        label: 'NITI Aayog',
        icon: Shield,
        colors: {
            bg: 'bg-[#f59e0b10]', // amber-500
            bgHover: 'hover:bg-[#f59e0b20]',
            bgSubtle: 'bg-[#f59e0b15]',
            border: 'border-[#f59e0b30]',
            text: 'text-[#f59e0b]',
            shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]'
        }
    },
    'NGO Darpan': {
        label: 'NGO Darpan',
        icon: BadgeCheck,
        colors: {
            bg: 'bg-[#f43f5e10]', // rose-500
            bgHover: 'hover:bg-[#f43f5e20]',
            bgSubtle: 'bg-[#f43f5e15]',
            border: 'border-[#f43f5e30]',
            text: 'text-[#f43f5e]',
            shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]'
        }
    },
    'default': {
        label: 'Verified',
        icon: BadgeCheck,
        colors: {
            bg: 'bg-orange-500/10',
            bgHover: 'hover:bg-orange-500/20',
            bgSubtle: 'bg-orange-500/15',
            border: 'border-orange-500/20',
            text: 'text-orange-400',
            shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.1)]'
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
