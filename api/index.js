const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

// Build service account from environment variables (set these on Vercel)
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// --- ROUTES ---

app.post('/students', async (req, res) => {
  try {
    const data = req.body;
    const ref = await db.collection('students').add(data);
    res.status(201).send({ id: ref.id, message: "Student added successfully!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/students', async (req, res) => {
  try {
    const snapshot = await db.collection('students').get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const doc = await db.collection('students').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send({ message: "Student not found" });
    res.send({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    await db.collection('students').doc(req.params.id).update(req.body);
    res.send({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await db.collection('students').doc(req.params.id).delete();
    res.send({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = serverless(app);
