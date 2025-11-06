// src/controllers/userController.js
import db from "../config/firebase.js";

// CREATE
export const createUser = async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    if (!data.role || !data.firstName || !data.email)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await db.collection("users").where("email", "==", data.email).get();
    if (!existing.empty)
      return res.status(400).json({ message: "Email already exists" });

    // Remove undefined fields
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const docRef = await db.collection("users").add(data);
    res.status(201).json({ id: docRef.id, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// READ ALL (optional filters)
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = db.collection("users");
    if (role) query = query.where("role", "==", role);

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ by ID
export const getUser = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    const data = req.body;
    data.updatedAt = new Date();

    // Remove undefined fields
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const docRef = db.collection("users").doc(req.params.id);
    await docRef.update(data);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE
export const deleteUser = async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
