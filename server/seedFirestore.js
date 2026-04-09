const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// IMPORTANT: You need to download your service account key from Firebase Console
// Project Settings > Service Accounts > Generate new private key
// Save it as 'serviceAccountKey.json' in the 'server' directory
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedData = async () => {
    try {
        const filePath = path.join(__dirname, 'ngos.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const ngos = JSON.parse(rawData);

        console.log(`Found ${ngos.length} NGOs to seed.`);

        const batch = db.batch();
        const ngosCol = db.collection('ngos');

        ngos.forEach((ngo) => {
            // Use existing id if present, or let Firestore generate one
            const docRef = ngo.id ? ngosCol.doc(ngo.id.toString()) : ngosCol.doc();
            
            // Remove MongoDB specific _id if it exists
            const { _id, ...cleanNgo } = ngo;
            
            batch.set(docRef, {
                ...cleanNgo,
                verified: cleanNgo.verified || false,
                createdAt: cleanNgo.createdAt || new Date().toISOString()
            });
        });

        await batch.commit();
        console.log('Successfully seeded Firestore with NGO data!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
