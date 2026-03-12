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

    // Legal Compliance (5 points each for key registrations)
    if (ngo.legalDetails) {
        let legalPoints = 0;
        if (ngo.legalDetails.registrationNo) legalPoints += 5;
        if (ngo.legalDetails.section80G) legalPoints += 5;
        if (ngo.legalDetails.section12A) legalPoints += 5;
        if (ngo.legalDetails.csr1) legalPoints += 5;
        if (legalPoints > 0) {
            score += legalPoints;
            breakdown.push({ label: 'High-Value Legal IDs (80G/CSR-1)', points: legalPoints });
        }
    }

    // Digital & Social Presence
    if (ngo.website) { score += 3; breakdown.push({ label: 'Official Website', points: 3 }); }
    const socials = ngo.socialLinks || ngo.socials;
    if (socials) {
        let socialPoints = 0;
        if (socials.facebook) socialPoints += 1;
        if (socials.instagram) socialPoints += 1;
        if (socials.youtube) socialPoints += 1;
        if (socials.linkedin) socialPoints += 1;
        if (socialPoints > 0) {
            score += socialPoints;
            breakdown.push({ label: 'Social Media Sync', points: socialPoints });
        }
    }

    // Financial Transparency
    if (ngo.financials) {
        let finPoints = 0;
        if (ngo.financials.upiId) finPoints += 5;
        if (ngo.financials.auditStatus === 'Audited') finPoints += 5;
        if (ngo.financials.reportsLink) finPoints += 5;
        if (finPoints > 0) {
            score += finPoints;
            breakdown.push({ label: 'Financial Transparency', points: finPoints });
        }
    } else if (ngo.mockUPI || ngo.bankDetails) {
        score += 5;
        breakdown.push({ label: 'Payment Channel', points: 5 });
    }

    // Geographic Reach & Impact
    if (ngo.geoReach && ngo.geoReach.length > 0) {
        score += 5;
        breakdown.push({ label: 'Geographic Focus', points: 5 });
    }
    if (ngo.impactStats && ngo.impactStats.length > 0) {
        score += 10;
        breakdown.push({ label: 'Quantifiable Impact Stats', points: 10 });
    }
    if (ngo.programs && ngo.programs.length > 0) {
        score += 5;
        breakdown.push({ label: 'Program Portfolio', points: 5 });
    }

    // Certifications (5 points each)
    if (ngo.certifications && ngo.certifications.length > 0) {
        const certPoints = ngo.certifications.length * 5;
        score += certPoints;
        breakdown.push({ label: 'Verified Certifications', points: certPoints });
    }

    // Verified Status (15 points) -> Significant bump
    if (ngo.verified) { 
        score += 15; 
        breakdown.push({ label: 'Platform Verified', points: 15 }); 
    }

    // Normalize to 100
    // Estimated max points: ~120
    const normalizedScore = Math.min(Math.round((score / 100) * 100), 100);

    return {
        score: normalizedScore,
        rawScore: score,
        breakdown,
        level: normalizedScore >= 80 ? 'High Trust' : normalizedScore >= 50 ? 'Moderate Trust' : 'Needs More Info'
    };
};
