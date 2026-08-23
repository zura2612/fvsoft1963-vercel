// app/api/mcp/route.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "fvsoft1963-mcp", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

// Déclaration des outils
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_services",
      description: "Retourne les prestations et stacks techniques de François Vauchot",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

// Exécution d'un outil
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_services") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            services: ["Développement Next.js", "Serverless Cloudflare", "Audit Web Vitals"],
          }),
        },
      ],
    };
  }
  throw new Error("Outil inconnu");
});