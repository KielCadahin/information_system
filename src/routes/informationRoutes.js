import express from "express";
import db from "../config/firebase.js";

const router = express.Router();

// 🔹 COLLECTION references
const studentsRef = db.collection("students");
const teachersRef = db.collection("teachers");
const adminsRef = db.collection("admins");

/* ===========================
   🧑‍🎓 STUDENT ROUTES
   =========================== */

// CREATE student
router.post("/students", async (req, res) => {
  try {
    const { name, email, course, year } = req.body;
    const newStudent = { name, email, course, year, createdAt: new Date() };
    const docRef = await studentsRef.add(newStudent);
    res.status(201).json({ id: docRef.id, message: "Student added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all students
router.get("/students", async (req, res) => {
  try {
    const snapshot = await studentsRef.get();
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE student
router.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await studentsRef.doc(id).update(req.body);
    res.json({ message: "Student updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student
router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await studentsRef.doc(id).delete();
    res.json({ message: "Student deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   👩‍🏫 TEACHER ROUTES
   =========================== */

router.post("/teachers", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const newTeacher = { name, email, department, createdAt: new Date() };
    const docRef = await teachersRef.add(newTeacher);
    res.status(201).json({ id: docRef.id, message: "Teacher added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/teachers", async (req, res) => {
  try {
    const snapshot = await teachersRef.get();
    const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/teachers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await teachersRef.doc(id).update(req.body);
    res.json({ message: "Teacher updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await teachersRef.doc(id).delete();
    res.json({ message: "Teacher deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   👨‍💼 ADMIN ROUTES
   =========================== */

router.post("/admins", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newAdmin = { name, email, role: role || "admin", createdAt: new Date() };
    const docRef = await adminsRef.add(newAdmin);
    res.status(201).json({ id: docRef.id, message: "Admin added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admins", async (req, res) => {
  try {
    const snapshot = await adminsRef.get();
    const admins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await adminsRef.doc(id).update(req.body);
    res.json({ message: "Admin updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await adminsRef.doc(id).delete();
    res.json({ message: "Admin deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
