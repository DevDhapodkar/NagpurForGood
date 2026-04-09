export const calculateTrustScore = (ngo) => {
    let score = 0;
    const breakdown = [];
    const MAX_SCORE = 100; // Define a reasonable maximum or calculate dynamically

    // Basic Info (2 points each)
    if (ngo.name) { score += 2; breakdown.push({ label: 'NGO Name', points: 2 }); }
    if (ngo.address) { score += 2; breakdown.push({ label: 'Valid Address', points: 2 }); }
    if (ngo.contact) { score += 2; breakdown.push({ label: 'Contact Info', points: 2 }); }
    if (ngo.description || ngo.longDescription) { score += 4; breakdown.push({ label: 'Detailed Mission', points: 4 }); }
    if (ngo.chairperson || ngo.founder) { score += 2; breakdown.push({ label: 'Leadership Info', points: 2 }); }

    // Digital Presence (1 point each)
    if (ngo.website) { score += 3; breakdown.push({ label: 'Official Website', points: 3 }); }
    if (ngo.socialLinks) {
        let socialPoints = 0;
        if (ngo.socialLinks.facebook) socialPoints += 1;
        if (ngo.socialLinks.instagram) socialPoints += 1;
        if (ngo.socialLinks.youtube) socialPoints += 1;
        if (ngo.socialLinks.twitter) socialPoints += 1;
        if (socialPoints > 0) {
            score += socialPoints;
            breakdown.push({ label: 'Social Media Presence', points: socialPoints });
        }
    }

    // Certifications (5 points each)
    if (ngo.certifications && ngo.certifications.length > 0) {
        const certPoints = ngo.certifications.length * 5;
        score += certPoints;
        breakdown.push({ label: `${ngo.certifications.length} Certifications`, points: certPoints });
    }

    // Verified Status (15 points) -> Significant bump
    if (ngo.verified) { 
        score += 15; 
        breakdown.push({ label: 'Verified Status', points: 15 }); 
    }

    // Impact & Programs (up to 10 points)
    if (ngo.impactStats && ngo.impactStats.length > 0) {
        score += 5;
        breakdown.push({ label: 'Impact Statistics', points: 5 });
    }
    if (ngo.programs && ngo.programs.length > 0) {
        score += 5;
        breakdown.push({ label: 'Documented Programs', points: 5 });
    }
    
    // Financial Transparency
    if (ngo.mockUPI || ngo.bankDetails) {
        score += 5;
        breakdown.push({ label: 'Verified Payment Channel', points: 5 });
    }

    // Optional: Normalize to 100
    // Currently max points achievable above is approx ~70 depending on certs.
    // Let's cap at 100 and return a percentage.
    const normalizedScore = Math.min(Math.round((score / 60) * 100), 100);

    return {
        score: normalizedScore,
        rawScore: score,
        breakdown,
        level: normalizedScore >= 80 ? 'High Trust' : normalizedScore >= 50 ? 'Moderate Trust' : 'Needs More Info'
    };
};
