// lib/data/realisations.ts

export interface RealisationImage {
  url: string;     // Chemin de l'asset WebP / PNG
  caption: string; // Description courte / légende (ex: "Tableau de bord admin")
}

export interface Realisation {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  stack: string[];
  coverImage: string;
  images: RealisationImage[];
  demoUrl?: string;
}

export const REALISATIONS: Realisation[] = [
  {
    id: "1",
    slug: "site-vitrine-toilettage",
    title: "Site vitrine pour activités professionnelles",
    shortDescription: "Site vitrine avec inscription, formulaire de contact et prise de rendez-vous",
    fullDescription: "Développement d'un site vitrine professionnel pour une activité de services, intégrant nativement un système de prise de rendez-vous en ligne via Cal.com. Le projet a été conçu avec une architecture full-stack moderne reposant sur React 19, TypeScript 6, et un déploiement multi-plateforme (Cloudflare Workers + Vercel) permettant de tirer parti de l'edge computing pour garantir des performances optimales à l'international. Le site est entièrement internationalisé (FR/EN), accessible (conformité ARIA via Radix UI), SEO-friendly (SSR, sitemaps automatiques) et testé (suite Vitest + Testing Library).",
    stack: ["React19", "TypeScript", "Vite7", "Tailwind CSS", "TanStack", "Cloudflare Workers", "Vercel", "SSR", "Cal.com", "Workos.com"],
    coverImage: "/images/realisations/site-vitrine-toilettage-cover.webp",
    images: [
      {
        url: "/images/realisations/site-vitrine-toilettage-1.webp",
        caption: "Services",
      },
      {
        url: "/images/realisations/site-vitrine-toilettage-2.webp",
        caption: "A propos",
      },
      {
        url: "/images/realisations/site-vitrine-toilettage-3.webp",
        caption: "Contact",
      },
      {
        url: "/images/realisations/site-vitrine-toilettage-4.webp",
        caption: "Rendez-vous",
      },
    ],
    demoUrl: "https://sitetoilettage47.vercel.app/",
  },

  {
    id: "2",
    slug: "gestion-bibliotheque",
    title: "Application Full-Stack de Gestion de Bibliothèque sur Mesure",
    shortDescription: "Interface applicative réactive pour la gestion d'une bibliothèque avec tableaux de bord interactifs.",
    fullDescription: "Développement d'une application complète de gestion de bibliothèque, permettant la gestion en temps réel des livres, des abonnés et des emprunts. L'application intègre des fonctionnalités avancées comme la recherche automatique par ISBN via l'API Google Books, le suivi des abonnements, la détection des retards et l'export CSV",
    stack: ["React19", "Express4", "Sqlite", "CRUD", "Tailwind CSS", "TypeScript", "Vite"],
    coverImage: "/images/realisations/gestion-biblio-cover.webp",
    images: [
      {
        url: "/images/realisations/gestion-biblio-1.webp",
        caption: "Livres",
      },
      {
        url: "/images/realisations/gestion-biblio-2.webp",
        caption: "Abonnés",
      },
      {
        url: "/images/realisations/gestion-biblio-3.webp",
        caption: "Emprunts",
      },
      {
        url: "/images/realisations/gestion-biblio-4.webp",
        caption: "Ajout Livre",
      },
    ],
  },

  {
    id: "3",
    slug: "boutique-bijoux",
    title: "Application e-commerce de vente de bijoux",
    shortDescription: "Interface applicative pour la vente de bijoux en ligne avec gestion des stocks",
    fullDescription: "Développement d'une application e-commerce complète pour la vente de bijoux fantaisie, implémentant une architecture full-stack moderne avec séparation claire frontend/backend. Le système intègre un catalogue produits, la gestion de panier persistant, le processus de checkout, l’authentification JWT sécurisée avec refresh tokens et notifications par email.",
    stack: ["React18", "Express4", "JWT", "CORS", "Sqlite", "Vite", "Zustand"],
    coverImage: "/images/realisations/e-commerce-cover.webp",
    images: [
      {
        url: "/images/realisations/e-commerce-1.webp",
        caption: "Catalogue",
      },
      {
        url: "/images/realisations/e-commerce-2.webp",
        caption: "Panier",
      },
      {
        url: "/images/realisations/e-commerce-3.webp",
        caption: "Finaliser Commande",
      },
      {
        url: "/images/realisations/e-commerce-4.webp",
        caption: "Mes commandes",
      },
    ],
  },
];