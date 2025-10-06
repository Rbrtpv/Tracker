import express, { Request, Response } from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.post("/ai", async (req: Request, res: Response) => {
  try {
    let textToAnalyze: string | undefined;

    if (req.body.text) {
      textToAnalyze = req.body.text;
    }
    else if (req.body.answers) {
      const answers = req.body.answers;
      const feeling = answers.q1_feeling ? `El usuario se siente ${answers.q1_feeling} hoy.` : '';
      const productivity = answers.q2_productivity ? `Fue ${answers.q2_productivity}.` : '';
      const sleep = answers.q3_sleep ? `Durmió ${answers.q3_sleep} anoche.` : '';

      textToAnalyze = [feeling, productivity, sleep].filter(Boolean).join(' ');

      if (!textToAnalyze.trim()) {
        return res.status(400).json({ error: "No answers provided for analysis" });
      }
    } else {
      return res.status(400).json({ error: "No text or answers provided for analysis" });
    }

    if (!textToAnalyze) {
      return res.status(400).json({ error: "No valid input for analysis" });
    }

    const response = await fetch("http://ai:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textToAnalyze }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service not available or internal server error" });
  }
});

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
