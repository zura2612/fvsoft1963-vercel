// app/api/mcp/route.ts
import { NextResponse } from "next/server";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 1. Initialisation unique du serveur MCP
const server = new Server(
  { name: "fvsoft1963-mcp", version: "1.0.0" },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// ==========================================
// 2. REQUÊTES RESSOURCES (RESOURCES)
// ==========================================

// Liste des ressources accessibles par l'agent IA
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "fvsoft://services",
      name: "Services & Prestations",
      mimeType: "application/json",
      description: "Liste des compétences, stacks techniques et prestations proposées",
    },
    {
      uri: "fvsoft://realisations",
      name: "Portfolio des projets",
      mimeType: "application/json",
      description: "Index des cas d'étude et projets clients",
    },
  ],
}));

// Lecture du contenu d'une ressource demandée
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "fvsoft://services") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({
            developer: "François Vauchot",
            services: [
              {
                id: "fullstack",
                title: "Développement Web sur mesure",
                stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
              },
              {
                id: "serverless",
                title: "Architecture Edge Cloudflare",
                stack: ["Cloudflare Workers", "Pages", "D1", "Hono"],
              },
              {
                id: "audit",
                title: "Audit & Performance Web",
                stack: ["Lighthouse", "Core Web Vitals", "SEO"],
              },
            ],
          }),
        },
      ],
    };
  }

  if (uri === "fvsoft://realisations") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify([
            { slug: "fv-elec-47", title: "Vitrine FV ELEC 47", category: "Showcase App" },
            { slug: "admin-worker", title: "Gestionnaire Cloudflare Worker", category: "Edge API" },
          ]),
        },
      ],
    };
  }

  throw new Error(`Ressource non trouvée : ${uri}`);
});

// ==========================================
// 3. REQUÊTES OUTILS (TOOLS)
// ==========================================

// Déclaration des outils exécutables
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_services",
      description: "Retourne la liste des prestations et stacks techniques",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "send_inquiry",
      description: "Transmet une demande de contact ou un besoin client",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nom du contact" },
          email: { type: "string", description: "Adresse email" },
          message: { type: "string", description: "Détails du projet" },
        },
        required: ["name", "email", "message"],
      },
    },
  ],
}));

// Exécution d'un outil
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_services") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            services: [
              "Développement Web sur mesure (Next.js / React)",
              "Architecture Serverless & Edge Cloudflare",
              "Audit & Performance Web",
            ],
          }),
        },
      ],
    };
  }

  if (name === "send_inquiry") {
    const { name: senderName, email, message } = (args || {}) as {
      name?: string;
      email?: string;
      message?: string;
    };

    // Traitement métier (ex: envoi d'email via Resend)
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Demande de ${senderName} (${email}) enregistrée avec succès. Message : ${message}`,
          }),
        },
      ],
    };
  }

  throw new Error(`Outil inconnu : ${name}`);
});

// ==========================================
// 4. ENDPOINT ROUTE HANDLER (POST / JSON-RPC)
// ==========================================

export async function POST(req: Request) {
  try {
    const jsonRpcRequest = await req.json();

    // Raccordement simple du cycle de vie JSON-RPC sans transport WebSockets/SSE complexe
    // (Pour une connexion persistante Claude Desktop / Cursor, privilégier un transport SSE)
    return NextResponse.json({
      jsonrpc: "2.0",
      id: jsonRpcRequest.id ?? null,
      result: { message: "Serveur MCP opérationnel (Resources & Tools disponibles)" },
    });
  } catch (error) {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message: (error as Error).message } },
      { status: 500 }
    );
  }
}