import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import informationRoutes from "../src/routes/informationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Information System Microservice Connected!");
});

// Use routes from /src/routes
app.use("/api", informationRoutes);

export const handler = serverless(app);
