"use client";

import Link from "next/link";
// MODIFICATION 1: Import de TargetAndTransition pour typer strictement les objets d'animation Framer Motion 13
import { motion, Variants, TargetAndTransition } from "framer-motion";
import { Code2, Cpu, Gauge, ArrowRight } from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface Service {
  id: string;
  title: string;
  description: string;
  icon: typeof Code2;
  technologies: string[];
}

// ==========================================
// 2. CONSTANTES DE COULEURS & ANIMATIONS AURORA
// ==========================================

// MODIFICATION 2: Constante des couleurs Aurora nommées en français (Hexadécimaux Tailwind 400)
const AURORA_COLORS = {
  indigo: "#818cf8",    // Indigo
  turquoise: "#2dd4bf", // Turquoise
  rose: "#f472b6",      // Rose
  ambre: "#fbbf24",     // Ambre
} as const;

// MODIFICATION 3: Animation des 4 blobs gérée directement en JS/Framer Motion (bypass la purge CSS Vercel).
// Utilisation du type Record<string, TargetAndTransition> pour valider "easeInOut" auprès du type-checker TS de Framer Motion 13.
const auroraBlobVariants: Record<string, TargetAndTransition> = {
  blob1: {
    x: [0, "25vw", "-15vw", 0],
    y: [0, "20vh", "25vh", 0],
    scale: [1, 1.3, 0.75, 1],
    transition: { duration: 16, repeat: Infinity, ease: "easeInOut" },
  },
  blob2: {
    x: [0, "-22vw", 0],
    y: [0, "-18vh", 0],
    scale: [1, 1.35, 1],
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" },
  },
  blob3: {
    x: [0, "-18vw", "14vw", 0],
    y: [0, "15vh", "-12vh", 0],
    scale: [1, 0.7, 1.25, 1],
    transition: { duration: 14, repeat: Infinity, ease: "easeInOut" },
  },
  blob4: {
    x: [0, "20vw", 0],
    y: [0, "-18vh", 0],
    scale: [1, 1.4, 1],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
  },
};

// MODIFICATION 4: Bruit SVG encodé en Data URI inline pour annuler toute dépendance envers globals.css
const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const services: Service[] = [
  {
    id: "fullstack",
    title: "Développement Web sur mesure",
    description:
      "Conception d'applications web réactives, robustes et maintenables. Du schéma de données jusqu'à l'interface utilisateur.",
    icon: Code2,
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  },
  {
    id: "serverless",
    title: "Architecture Serverless & Edge Cloudflare",
    description:
      "Déploiement global à faible latence. Utilisation des Workers, KV namespaces et Pager pour des performances optimales.",
    icon: Cpu,
    technologies: ["Cloudflare Workers", "Pages", "KV / D1", "Hono", "Edge API"],
  },
  {
    id: "audit",
    title: "Audit & Performance Web",
    description:
      "Optimisation du temps de chargement, Core Web Vitals, réduction du bundle JS et mise aux normes d'accessibilité.",
    icon: Gauge,
    technologies: ["Lighthouse", "Web Vitals", "bundle-analyzer", "SEO", "Cache Strategy"],
  },
];

// ==========================================
// 3. VARIANTES FRAMER MOTION (CONTENU)
// ==========================================

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ==========================================
// 4. COMPOSANT PRINCIPAL
// ==========================================

export default function Services() {
  return (
    // MODIFICATION 5: Fond blanc pur (bg-white) en mode clair pour maximiser le contraste visuel de l'Aurora
    <section className="relative overflow-hidden py-6 rounded-2xl bg-white dark:bg-[#0b0d17] border border-black dark:border-white transition-colors duration-300">
      
      {/* MODIFICATION 6: Arrière-plan Aurora animé à 100% via Framer Motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob Indigo */}
        <motion.div
          animate={auroraBlobVariants.blob1}
          className="absolute rounded-full blur-[60px] dark:mix-blend-screen opacity-70 dark:opacity-60 w-[55vmax] h-[55vmax] -top-[15%] -left-[10%]"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${AURORA_COLORS.indigo}, transparent 70%)`,
          }}
        />
        {/* Blob Turquoise */}
        <motion.div
          animate={auroraBlobVariants.blob2}
          className="absolute rounded-full blur-[60px] dark:mix-blend-screen opacity-70 dark:opacity-60 w-[45vmax] h-[45vmax] -bottom-[10%] -right-[5%]"
          style={{
            background: `radial-gradient(circle at 60% 40%, ${AURORA_COLORS.turquoise}, transparent 70%)`,
          }}
        />
        {/* Blob Rose */}
        <motion.div
          animate={auroraBlobVariants.blob3}
          className="absolute rounded-full blur-[60px] dark:mix-blend-screen opacity-70 dark:opacity-60 w-[38vmax] h-[38vmax] top-[30%] right-[10%]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${AURORA_COLORS.rose}, transparent 70%)`,
          }}
        />
        {/* Blob Ambre */}
        <motion.div
          animate={auroraBlobVariants.blob4}
          className="absolute rounded-full blur-[60px] dark:mix-blend-screen opacity-70 dark:opacity-60 w-[30vmax] h-[30vmax] bottom-[15%] left-[20%]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${AURORA_COLORS.ambre}, transparent 70%)`,
          }}
        />

        {/* Texture de Grain Inline */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: `url("${GRAIN_DATA_URI}")` }}
        />
      </div>

      {/* Contenu UI */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-2xl mx-auto text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Nos Services & Prestations
          </h2>
          <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
            Des solutions logicielles adaptées aux exigences modernes du web et du Cloud.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            const targetUrl = `/contact?subject=${encodeURIComponent(service.title)}`;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="h-full"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -10 }}
              >
                {/* MODIFICATION 7: Arrière-plan des cartes en transparence légère (bg-white/85 & dark:bg-gray-900/85 + backdrop-blur-sm) pour laisser passer le fond lumineux */}
                <Link
                  href={targetUrl}
                  className="group relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm border border-black dark:border-white hover:border-blue-500 dark:hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-black dark:border-white flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>En savoir plus</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}