// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import { textModel, imageModel } from "./gemini.js";

/* --- Text: fast resume summaries, keywords, advice --- */
export const geminiText = onRequest(async (req, res) => {
  try {
    const prompt = req.query.prompt || "Summarize Trade Hustle's mission.";
    const result = await textModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ success: true, text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --- Image: generate or edit Trade Hustle visuals --- */
export const geminiImage = onRequest(async (req, res) => {
  try {
    const prompt =
      req.query.prompt ||
      "Create a gritty Trade Hustle-style banner with blue and red paint splatters.";
    const result = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const imageData = result?.response?.candidates?.[0]?.content?.parts?.[0];
    res.json({ success: true, image: imageData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});