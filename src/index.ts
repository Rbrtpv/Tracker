import express, { Request, Response } from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); 
app.use(express.static(path.join(process.cwd(), "public")));

app.post("/ai", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for analysis" });
    }

    const response = await fetch("http://ai:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service not available or internal server error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
