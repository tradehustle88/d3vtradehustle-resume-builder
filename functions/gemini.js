import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = "tradehustleresumebuilder";
const LOCATION = "us-central1";

const vertex = new VertexAI({ project: PROJECT_ID, location: LOCATION });

/** Fast text for resume builder */
export const textModel = vertex.getGenerativeModel({
  model: "projects/google/models/gemini-2.0-flash-lite-001",
});

/** Image generation / editing */
export const imageModel = vertex.getGenerativeModel({
  model: "projects/google/models/gemini-2.5-flash-image-001",
});