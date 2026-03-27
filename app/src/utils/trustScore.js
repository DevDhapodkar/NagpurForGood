export const calculateTrustScore = (ngo) => {
    const overrides = ngo.trustScoreOverrides || {};
    const breakdown = [];

    const addCriteria = (label, maxPoints, condition) => {
        const manualOverride = overrides[label];
        let achieved, autoPoints;
        if (typeof condition === 'number') {
            autoPoints = condition;
            achieved = condition > 0;
        } else {
            autoPoints = condition ? maxPoints : 0;
            achieved = !!condition;
        }
        
        const pointsValue = manualOverride !== undefined ? manualOverride : autoPoints;
        
        breakdown.push({
            label,
            points: pointsValue,
            maxPoints: maxPoints,
            achieved: achieved,
            overridden: manualOverride !== undefined
        });
        return pointsValue;
    };

    let totalScore = 0;

    // 1. Digital Base
    totalScore += addCriteria('Official Website', 5, !!ngo.website);
    totalScore += addCriteria('Verified Email', 2, !!(ngo.email || ngo.socialLinks?.email));
    totalScore += addCriteria('Direct Contact Info', 2, !!ngo.contact);
    totalScore += addCriteria('Physical Address', 2, !!ngo.address);
    totalScore += addCriteria('Mission Transparency', 4, !!(ngo.description || ngo.longDescription));

    // 2. Legal Compliance
    totalScore += addCriteria('Legal Registration', 2, !!ngo.legalDetails?.registrationNo);
    totalScore += addCriteria('80G Tax Exemption', 8, !!ngo.legalDetails?.section80G);
    totalScore += addCriteria('12A Registration', 5, !!ngo.legalDetails?.section12A);
    totalScore += addCriteria('CSR-1 Registration', 8, !!ngo.legalDetails?.csr1);
    totalScore += addCriteria('PAN Identity', 2, !!ngo.legalDetails?.panNo);

    // 3. Leadership Transparency
    const leaders = [...(ngo.boardOfDirectors || []), ...(ngo.teamAndLeadership || [])];
    totalScore += addCriteria('Organizational Chart', 5, leaders.length > 0);
    
    const linkedinCount = leaders.filter(l => l.linkedin).length;
    totalScore += addCriteria('Leadership Professional Verification', 10, linkedinCount > 0);

    // 4. Technology
    totalScore += addCriteria('Android App Presence', 5, !!ngo.appLinks?.android);
    totalScore += addCriteria('iOS App Presence', 5, !!ngo.appLinks?.ios);

    // 5. Social Media
    totalScore += addCriteria('Facebook Presence', 2, !!ngo.socialLinks?.facebook);
    totalScore += addCriteria('Instagram Presence', 2, !!ngo.socialLinks?.instagram);
    totalScore += addCriteria('YouTube Presence', 2, !!ngo.socialLinks?.youtube);
    totalScore += addCriteria('LinkedIn Page', 2, !!ngo.socialLinks?.linkedin);

    // 6. Social Proof
    totalScore += addCriteria('Data-Backed Impact', 10, !!(ngo.impactStats && ngo.impactStats.length > 0));
    totalScore += addCriteria('Awards & Recognition', 5, !!(ngo.awards && ngo.awards.length > 0));
    totalScore += addCriteria('Beneficiary Testimonials', 5, !!(ngo.testimonials && ngo.testimonials.length > 0));
    totalScore += addCriteria('Active Volunteer Opportunities', 5, !!ngo.volunteerOps);

    // 7. Admin PR
    let prPoints = 0;
    if (ngo.adminPR) {
        const pr = ngo.adminPR;
        // Base points for having PR data (4) + visit (6) + ratings (avg of 4 ratings, max 10)
        // Total Max: 4 + 6 + 10 = 20
        prPoints = 4;
        if (pr.fieldVisitDone) prPoints += 6;
        
        const ratingsSum = (pr.experienceScore || 0) + 
                          (pr.transparencyRating || 0) + 
                          (pr.teamResponsiveness || 0) + 
                          (pr.reputationScore || 0);
        prPoints += Math.round(ratingsSum / 4);
    }
    totalScore += addCriteria('Admin PR Field Verification', 20, prPoints);

    // 8. Financials
    totalScore += addCriteria('UPI Donation Integration', 5, !!ngo.financials?.upiId);
    totalScore += addCriteria('Audited Status', 5, ngo.financials?.auditStatus === 'Audited');
    totalScore += addCriteria('Public Financial Reports', 5, !!ngo.financials?.reportsLink);

    // 9. Verified Badge
    totalScore += addCriteria('Platform Verification Badge', 10, !!ngo.verified);

    const normalizedScore = Math.min(totalScore, 100);

    // Legacy manualScore Support
    if (ngo.manualScore !== undefined && ngo.manualScore !== null) {
        return {
            score: ngo.manualScore,
            rawScore: totalScore,
            breakdown,
            level: getLevel(ngo.manualScore),
            isManual: true
        };
    }

    return {
        score: normalizedScore,
        rawScore: totalScore,
        breakdown,
        level: getLevel(normalizedScore),
        isManual: !!Object.keys(overrides).length
    };
};

const getLevel = (score) => {
    if (score >= 80) return 'Highly Trusted';
    if (score >= 50) return 'Moderately Trusted';
    return 'Emerging Trust';
};
