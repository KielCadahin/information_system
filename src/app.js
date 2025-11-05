import express from "express";
import db from "./config/firebase.js";
import informationRoutes from "./routes/informationRoutes.js";

const app = express();
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("Information System Microservice Connected!");
});

// use routes
app.use("/api", informationRoutes);

export default app;
