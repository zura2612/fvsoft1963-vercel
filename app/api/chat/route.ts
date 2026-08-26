// app/api/chat/route.ts
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { cookies } from "next/headers"; // Nécessaire pour lire le cookie en Edge

import { profileSummary } from "@/content/profile";
import { chatRateLimit } from "@/lib/rate-limit"; // Import de notre utilitaire

// Activation explicite du Edge Runtime pour des performances optimales
export const runtime = 'edge';

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://fvsoft1963.com",
    "X-Title": "FVSOFT1963 Dev",
  },
});

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
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Clé OPENROUTER_API_KEY manquante dans l'environnement." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // 1. Récupération de l'identifiant de session (garanti par le middleware)
  const cookieStore = await cookies(); // 'await' est OBLIGATOIRE en Edge Runtime avec Next.js
  const sessionId = cookieStore.get('session_id')?.value || 'fallback-unknown';

  // 2. Vérification du Rate Limit
  const { success, limit, remaining, reset } = await chatRateLimit.limit(sessionId);

  if (!success) {
    return new Response(
      JSON.stringify({ 
        error: "Limite de requêtes atteinte. Veuillez patienter quelques instants.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString()
        } 
      }
    );
  }

  // 3. Validation Zod (votre logique existante)
  let parsed;
  try {
    const body = await req.json();
    parsed = BodySchema.parse(body);
  } catch {
    return new Response(
      JSON.stringify({ error: "Format de requête invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4. Appel au modèle et streaming (votre logique existante)
  try {
    const result = streamText({
      model: openrouter("nvidia/nemotron-3-ultra-550b-a55b:free"), // ou "meta-llama/llama-3-8b-instruct:free"
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