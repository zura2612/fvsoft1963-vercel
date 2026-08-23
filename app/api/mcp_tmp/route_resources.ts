import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "fvsoft1963-mcp", version: "1.0.0" },
  { capabilities: { resources: {} } }
);

// 1. Lister les ressources disponibles pour l'agent IA
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
      description: "Index des cas d'étude et projets clients développés",
    },
  ],
}));

// 2. Traiter la lecture d'une ressource demandée par l'agent
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