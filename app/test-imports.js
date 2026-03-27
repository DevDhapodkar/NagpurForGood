import * as lucide from 'lucide-react';
const icons = ['Building2', 'User', 'Phone', 'Mail', 'Globe', 'MapPin', 'FileText', 'Award', 'Shield', 'BadgeCheck', 'Plus', 'Trash2', 'ArrowRight', 'ArrowLeft', 'CheckCircle', 'Heart', 'Upload', 'Instagram', 'Youtube', 'Facebook', 'Star', 'ChevronDown', 'Milestone', 'HeartPulse'];
const missing = icons.filter(icon => !lucide[icon]);
if (missing.length > 0) {
    console.error("Missing icons:", missing);
    process.exit(1);
} else {
    console.log("All icons found!");
}
