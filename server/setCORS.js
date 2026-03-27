import admin from 'firebase-admin';
import fs from 'fs';
const serviceAccount = JSON.parse(fs.readFileSync(new URL('./serviceAccountKey.json', import.meta.url)));
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nagpurgoodorg.appspot.com'
});

async function setCors() {
    try {
        const dummyBucket = admin.storage().bucket('dummy');
        const [buckets] = await dummyBucket.storage.getBuckets();
        if (buckets.length === 0) {
            console.error('❌ No buckets found in this Firebase project!');
            process.exit(1);
        }

        const bucket = buckets[0];
        console.log(`Found bucket: ${bucket.name}. Configuring CORS...`);

        const corsConfiguration = [
            {
                origin: ["*"], // Allow all origins for testing
                method: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
                responseHeader: ["*"], 
                maxAgeSeconds: 3600
            }
        ];

        await bucket.setCorsConfiguration(corsConfiguration);
        console.log(`✅ Successfully configured CORS for ${bucket.name}!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to set CORS configuration:', error);
        process.exit(1);
    }
}

setCors();
