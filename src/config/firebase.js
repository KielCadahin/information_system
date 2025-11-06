import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables and parse private key safely
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing Firebase environment variables. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are set.");
}

let privateKey = FIREBASE_PRIVATE_KEY;
// Some tooling stores the private key wrapped in quotes; remove them if present
if (typeof privateKey === "string") {
  privateKey = privateKey.trim();
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  // convert escaped newlines to real newlines
  privateKey = privateKey.replace(/\\n/g, "\n");
} else {
  throw new Error("FIREBASE_PRIVATE_KEY is not a string");
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
} catch (err) {
  console.error("Failed to initialize Firebase Admin SDK:", err.message);
  throw err;
}

const db = admin.firestore();
// Optional: ignore undefined properties globally (prevents Firestore errors when undefined sneaks in)
try {
  db.settings({ ignoreUndefinedProperties: true });
} catch (err) {
  // Some Admin SDK versions may not support settings; ignore silently
}

export default db;
