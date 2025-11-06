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
    // remove undefined fields before sending to Firestore
    const newStudentRaw = { name, email, course, year, createdAt: new Date() };
    Object.keys(newStudentRaw).forEach(key => newStudentRaw[key] === undefined && delete newStudentRaw[key]);
    const docRef = await studentsRef.add(newStudentRaw);
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
    // sanitize update payload to remove undefined fields
    const updatePayload = { ...req.body };
    Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
    await studentsRef.doc(id).update(updatePayload);
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
    const newTeacherRaw = { name, email, department, createdAt: new Date() };
    Object.keys(newTeacherRaw).forEach(key => newTeacherRaw[key] === undefined && delete newTeacherRaw[key]);
    const docRef = await teachersRef.add(newTeacherRaw);
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
    const updatePayload = { ...req.body };
    Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
    await teachersRef.doc(id).update(updatePayload);
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
    const newAdminRaw = { name, email, role: role || "admin", createdAt: new Date() };
    Object.keys(newAdminRaw).forEach(key => newAdminRaw[key] === undefined && delete newAdminRaw[key]);
    const docRef = await adminsRef.add(newAdminRaw);
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
    const updatePayload = { ...req.body };
    Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);
    await adminsRef.doc(id).update(updatePayload);
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
