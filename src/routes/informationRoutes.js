import express from "express";
import db from "../config/firebase.js";

const router = express.Router();

const studentsRef = db.collection("students");

/* ========================
   STUDENT ROUTES
   ======================== */

// CREATE student
router.post("/students", async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date();

    const docRef = await studentsRef.add(data);
    res.status(201).json({ id: docRef.id, message: "Student added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all students
router.get("/students", async (req, res) => {
  try {
    const snapshot = await studentsRef.get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student by ID
router.get("/students/:id", async (req, res) => {
  try {
    const doc = await studentsRef.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Student not found" });
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE student
router.put("/students/:id", async (req, res) => {
  try {
    await studentsRef.doc(req.params.id).update(req.body);
    res.json({ message: "Student updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete("/students/:id", async (req, res) => {
  try {
    await studentsRef.doc(req.params.id).delete();
    res.json({ message: "Student deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
