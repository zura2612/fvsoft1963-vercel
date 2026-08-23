// app/api/chat/route.ts
import { streamText } from "ai";
//import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import { profileSummary } from "@/content/profile";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "FVSOFT1963 Dev",
  },
});

// Validation Zod pour sécuriser les données entrantes
const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
});

const SYSTEM_PROMPT = `Tu es l'assistant du site vitrine d'un développeur fullstack indépendant.
Réponds en français, de façon concise (3 phrases maximum sauf demande de détail), en markdown léger.
Appuie-toi UNIQUEMENT sur les informations ci-dessous. Si l'information n'y figure pas, dis-le et propose d'écrire à l'adresse e-mail de contact.
Ne fais pas de promesse commerciale (tarif, délai) qui ne serait pas dans ces informations.

--- INFORMATIONS ---
${profileSummary()}
--- FIN ---`;

export async function POST(req: Request) {
  //const apiKey = process.env.OPENAI_API_KEY;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Clé OPENROUTER_API_KEY manquante dans l'environnement." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let parsed;
  try {
    const body = await req.json();
    parsed = BodySchema.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Format de requête invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const result = streamText({
      //model: openai("gpt-4o-mini"),
      model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free"),
      system: SYSTEM_PROMPT,
      messages: parsed.messages,
      onError: ({ error }) => { console.error("[OpenRouter Stream Error]:", error); },
    });

    // Renvoie un stream text/plain interprétable directement par TextDecoder côté client
    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error("[API Chat Error]:", err);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la génération du message." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}