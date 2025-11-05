import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const app = express();
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Firebase connected successfully!");
});

// Example write test
app.post("/add", async (req, res) => {
  try {
    const { name, email } = req.body;
    await db.collection("users").add({ name, email });
    res.status(200).send("User added to Firebase!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Export for Vercel serverless
export default app;

// Local dev only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}







// Middleware: Verify Firebase ID token
async function verifyToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'] || '';
      const [, token] = authHeader.split(' ');
      if (!token) return res.status(401).json({ error: 'Missing Bearer token' });
  
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded; // may uid, email, etc.
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
  
  // Helpers
  function validateCreateBody(body) {
    const required = ['studentId', 'fullName', 'program', 'yearLevel', 'contact', 'address'];
    const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
    return { ok: missing.length === 0, missing };
  }
  
  // POST /students - Create student (Protected)
  app.post('/students', verifyToken, async (req, res) => {
    try {
      const { ok, missing } = validateCreateBody(req.body || {});
      if (!ok) return res.status(400).json({ error: 'Missing fields', missing });
  
      const { studentId, fullName, program, yearLevel, contact, address } = req.body;
  
      const docRef = db.collection('students').doc(String(studentId));
      const snap = await docRef.get();
      if (snap.exists) {
        return res.status(409).json({ error: 'Student already exists' });
      }
  
      const payload = {
        studentId: String(studentId),
        fullName: String(fullName),
        program: String(program),
        yearLevel: Number(yearLevel),
        contact: String(contact),
        address: String(address),
        uid: req.user?.uid || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      await docRef.set(payload, { merge: false });
      return res.status(201).json(payload);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create student' });
    }
  });
  
  // GET /students/:studentId - Retrieve student (Protected)
  app.get('/students/:studentId', verifyToken, async (req, res) => {
    try {
      const { studentId } = req.params;
      const docRef = db.collection('students').doc(String(studentId));
      const snap = await docRef.get();
      if (!snap.exists) return res.status(404).json({ error: 'Student not found' });
      return res.status(200).json(snap.data());
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve student' });
    }
  });
  
  // PUT /students/:studentId - Update student (Protected)
  app.put('/students/:studentId', verifyToken, async (req, res) => {
    try {
      const { studentId } = req.params;
      const allowedFields = ['fullName', 'program', 'yearLevel', 'contact', 'address'];
      const updates = {};
  
      for (const key of allowedFields) {
        if (key in req.body) updates[key] = req.body[key];
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updatable fields provided' });
      }
  
      updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  
      const docRef = db.collection('students').doc(String(studentId));
      const snap = await docRef.get();
      if (!snap.exists) return res.status(404).json({ error: 'Student not found' });
  
      const existing = snap.data() || {};
      if (!existing.uid && req.user?.uid) {
        updates.uid = req.user.uid;
      }
  
      await docRef.set(updates, { merge: true });
      const refreshed = await docRef.get();
      return res.status(200).json(refreshed.data());
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update student' });
    }
  });