import express, { Request, Response } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend with TypeScript" });
});

app.get("/ai", async (req: Request, res: Response) => {
  try {
    const response = await fetch("http://ai:5000/predict");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "AI service not available" });
  }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
