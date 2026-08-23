// config/site.ts
export const siteConfig = {
  name: "fvsoft1963",
  nom_entreprise: {
    prefix: "fvsoft", suffix: "1963",
  },
  description:
    "Ingénierie logicielle, applications web modernes et architectures Edge sur Next.js et Cloudflare.",
  url: "https://fvsoft1963.com",
  author: "François Vauchot",
  contact: {
    email: "contact@fvsoft1963.com",
    phone: "+33 6 52 72 85 69",
    location: "Lot-et-Garonne, France",
  },
  links: {
    github: "https://github.com/zura2612",
    linkedin: "https://linkedin.com/in/françois-vauchot-2781472b9",
  },
  skills: [
    "React / Next.js",
    "TypeScript",
    "Cloudflare Workers & KV",
    "Tailwind CSS",
    "Node.js & Python",
    "Architectures Serverless",
  ],
};

export type SiteConfig = typeof siteConfig;