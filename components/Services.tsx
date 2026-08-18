// components/Services.tsx
"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
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
// 2. CONSTANTES DE COULEURS ET DONNÉES EN DUR
// ==========================================

const AURORA_COLORS = {
  indigo: "#818cf8",
  turquoise: "#2dd4bf",
  rose: "#f472b6",
  ambre: "#fbbf24",
} as const;

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
// 3. VARIANTES FRAMER MOTION TYPÉES
// ==========================================

/** Animation de l'en-tête de section */
const headerVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20, // décalage vers le haut de 20 px 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier pour un arrêt fluide
    },
  },
};

/** Animation du conteneur parent (staggering) */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/** Animation individuelle des cartes enfant */
const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95, 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut",
    } 
  },
};

/* pour le fond aurora */
const style1 = "absolute rounded-full blur-[60px] dark:mix-blend-screen opacity-70 dark:opacity-60 will-change-transform";
// ==========================================
// 4. COMPOSANT PRINCIPAL
// ==========================================

export default function Services() {
  return (
    /* <section className="py-6 rounded-2xl bg-white dark:bg-black border border-black"> */
    <section className="relative overflow-hidden py-6 rounded-2xl bg-white dark:bg-[#0b0d17] border border-black dark:border-white transition-colors duration-300">
      
      {/* Arrière-plan Aurora + Texture Grain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`${style1} w-[55vmax] h-[55vmax] -top-[15%] -left-[10%] animate-aurora-1`}
          style={{
            background: "radial-gradient(circle at 30% 30%, ${AURORA_COLORS.indigo}, transparent 70%)",
          }}
        />
        <div
          className={`${style1} w-[45vmax] h-[45vmax] -bottom-[10%] -right-[5%] animate-aurora-2`}
          style={{
            background: "radial-gradient(circle at 60% 40%, ${AURORA_COLORS.turquoise}, transparent 70%)",
          }}
        />
        <div
          className={`${style1}  w-[38vmax] h-[38vmax] top-[30%] right-[10%] animate-aurora-3`}
          style={{
            background: "radial-gradient(circle at 50% 50%, ${AURORA_COLORS.rose}, transparent 70%)",
          }}
        />
        <div
          className={`${style1}  w-[30vmax] h-[30vmax] bottom-[15%] left-[20%] animate-aurora-4`}
          style={{
            background: "radial-gradient(circle at 50% 50%, ${AURORA_COLORS.ambre}, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.035] pointer-events-none bg-aurora-grain" />
      </div>
      
      {/*<div className="container mx-auto px-4 sm:px-6">*/}
      {/* contenu UI de la section */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* En-tête de section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-2xl mx-auto text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Nos Services & Prestations
          </h2>
          <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-white">
            Des solutions logicielles adaptées aux exigences modernes du web et du Cloud.
          </p>
        </motion.div>

        {/* Grille des 3 cartes animées */}
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
                key={service.id} variants={cardVariants} className="h-full"
                transition={{ duration: 0.2 }}
		whileHover={{ y: -10 }} //remontée verticale de 10px
              >
                <Link
                  href={targetUrl}
                  className="group relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-black dark:border-white hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div>
                    {/* Icône du service */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>

                    {/* Titre & Description */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Badges de technologies + CTA */}
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