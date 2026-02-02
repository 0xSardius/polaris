import { Opik } from "opik";

let opikClient: Opik | null = null;

export function getOpikClient(): Opik | null {
  if (opikClient) return opikClient;

  const apiKey = process.env.OPIK_API_KEY;
  if (!apiKey) {
    console.log("Opik: No API key found, tracing disabled");
    return null;
  }

  try {
    opikClient = new Opik({
      apiKey,
      projectName: process.env.OPIK_PROJECT_NAME || "polaris",
    });
    return opikClient;
  } catch (e) {
    console.error("Opik: Failed to initialize client:", e);
    return null;
  }
}
