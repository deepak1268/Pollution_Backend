const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getInfo = async (req, res) => {

    const ward = req.query.ward
  const sourceSchema = z.object({
    name: z.string(),
    description: z.string(),
    percentage: z.number(),
  });

  const advisorySchema = z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(["Low", "Medium", "High"]),
  });

  const reportSchema = z.object({
    sources: z.array(sourceSchema).default([]),
    citizenAdvisories: z.array(advisorySchema).default([]),
    authorityActions: z.array(advisorySchema).default([]),
  });

  function normalizeSources(raw) {
    if (!Array.isArray(raw)) return [];

    if (typeof raw[0] !== "object") return [];

    return raw
      .filter((item) => typeof item === "object")
      .map((item) => ({
        name: String(item.name ?? ""),
        description: String(item.description ?? ""),
        percentage: Number(item.percentage ?? 0),
      }))
      .filter((s) => s.name && !Number.isNaN(s.percentage));
  }

  function normalizeAdvisories(raw) {
    if (!Array.isArray(raw)) return [];

    if (typeof raw[0] !== "object") return [];

    return raw
      .filter((item) => typeof item === "object")
      .map((item) => ({
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        level: ["Low", "Medium", "High"].includes(item.level)
          ? item.level
          : "Medium",
      }))
      .filter((a) => a.title);
  }

const prompt = `Return ONLY valid JSON.
Provide pollution analysis for:
Ward: ${ward}
City: Delhi

Rules:
- sources MUST be an array of objects
- Do NOT return strings or numbers inside arrays

JSON FORMAT:
{
  "riskFactors": string[],
  "sources": {
    "name": string,
    "description": string,
    "percentage": number
  }[],
  "citizenAdvisories": {
    "title": string,
    "description": string,
    "level": "Low" | "Medium" | "High"
  }[],
  "authorityActions": {
    "title": string,
    "description": string,
    "level": "Low" | "Medium" | "High"
  }[]
}

IMPORTANT:
- If unsure, still invent realistic ward-specific data.
- Do not leave arrays empty.
`;

  function extractJson(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Model response is empty or not a string");
    }

    return text
      .replace(/```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleaned = extractJson(response.text);
    const raw = JSON.parse(cleaned);

    raw.sources = normalizeSources(raw.sources);
    raw.citizenAdvisories = normalizeAdvisories(raw.citizenAdvisories);
    raw.authorityActions = normalizeAdvisories(raw.authorityActions);
    raw.riskFactors = Array.isArray(raw.riskFactors) ? raw.riskFactors : [];

    const report = reportSchema.parse(raw);
    
    return res.status(200).json({
        report
    })
  } catch (err){
    console.error(err);
    return res.status(500).json({
        message: "Backend Server Error"
    })
  }
};

module.exports = { 
    getInfo
}