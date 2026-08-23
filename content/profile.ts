// content/profile.ts cohérence à assurer avec config/site.ts
import { REALISATIONS } from "@/lib/data/realisations";

/**
 * Source de vérité du profil et des informations réutilisées par l'assistant IA.
 */
export const profile = {
  name: "François Vauchot",
  role: "Développeur Web & Full-Stack",
  tagline:
    "Je conçois et développe des applications web sur mesure et des sites vitrines performants.",
  location: "Lot-et-Garonne",
  availability: "Disponible pour de nouveaux projets",
  email: "contact@fvsoft1963.com",
  phone: "+33 6 52 72 85 69",
  links: {
    github: "https://github.com/zura2612",
    linkedin: "https://linkedin.com/in/françois-vauchot-2781472b9",
  },
  stack: [
    {
      group: "Front-end",
      items: ["React 19", "TypeScript", "Next.js", "Tailwind CSS", "Vite", "TanStack"],
    },
    {
      group: "Back-end & BDD",
      items: ["Node.js", "Express", "SQLite", "Cloudflare Workers", "REST API", "JWT"],
    },
    {
      group: "Déploiement & Outils",
      items: ["Vercel", "Cloudflare Pages/Workers", "Git", "Cal.com", "WorkOS"],
    },
  ],
  method: [
    {
      title: "Cadrage & Architecture",
      body: "Analyse du besoin, choix de la stack technique et définition de l'interface.",
    },
    {
      title: "Développement réactif",
      body: "Code propre, typé en TypeScript, avec livraisons régulières et retours en direct.",
    },
    {
      title: "Mise en production & SEO",
      body: "Déploiement sur infrastructure Edge/Serverless (Vercel, Cloudflare), performances et référencement.",
    },
  ],
} as const;

/**
 * Génère le contexte d'informations structuré à destination du prompt système de l'IA.
 */
export function profileSummary(): string {
  const stackGlobal = profile.stack
    .map((s) => `${s.group} : ${s.items.join(", ")}`)
    .join(" | ");

  const realisationsFormatted = REALISATIONS.map((r) => {
    let projectLine = `- ${r.title} (slug: ${r.slug}) : ${r.shortDescription}`;
    if (r.fullDescription) {
      projectLine += ` ${r.fullDescription}`;
    }
    projectLine += ` [Stack: ${r.stack.join(", ")}]`;
    if (r.demoUrl) {
      projectLine += ` [Démo en ligne: ${r.demoUrl}]`;
    }
    return projectLine;
  }).join("\n");

  return [
    `Nom : ${profile.name}`,
    `Rôle : ${profile.role}`,
    `Positionnement : ${profile.tagline}`,
    `Localisation : ${profile.location}`,
    `Disponibilité : ${profile.availability}`,
    `Contact : ${profile.email}`,
    `Téléphone : ${profile.phone}`,
    `Stack globale : ${stackGlobal}`,
    `Méthode de travail : ${profile.method.map((m) => `${m.title} — ${m.body}`).join(" | ")}`,
    `Réalisations & Projets :\n${realisationsFormatted}`,
  ].join("\n");
}