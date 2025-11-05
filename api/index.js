import app from '../server.js';

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

export default app;