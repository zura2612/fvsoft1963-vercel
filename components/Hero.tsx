// components/Hero.tsx
"use client";

//import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export interface HeroProps {
  className?: string;
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: customDelay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const boutonClassName = "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 w-full sm:w-auto";

//export const Hero: React.FC<HeroProps> = ({ className = "" }) => {
//export default function Hero() {
export default function Hero({ className = "" }: HeroProps) {
  return (
    <section
      className={`relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden py-4 md:py-8 rounded-2xl ${className}`}
    >
      {/* 1. ARRIÈRE-PLAN : Image WebP */}
      <Image
        src="/images/fond_hero.webp"
        alt="Arrière-plan fvsoft1963"
        fill
        priority
        quality={75} // valeur par défaut
        sizes="100vw"
        className="object-cover object-center z-0 pointer-events-none"
      />

      {/* 2. OVERLAY DYNAMIQUE */}
      {/*<div className="absolute inset-0 bg-slate-100/70 dark:bg-slate-950/60 backdrop-blur-[1px] z-10 pointer-events-none transition-colors duration-300" />*/}
      {/* 2. OVERLAY : Masque léger pour garantir la lisibilité du texte */}
      <div className="absolute inset-0 bg-slate-950/30 z-10 pointer-events-none" />      

      {/* 3. CONTENU */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Badge d'état */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-50/80 dark:bg-blue-500/20 dark:border-blue-400/30 text-blue-700 dark:text-blue-200 text-xs font-medium backdrop-blur-md transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400" />
          </span>
          <span className="text-sm">À votre service</span>
        </motion.div>

        {/* Titre Principal */}
        <motion.h1
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white dark:text-white transition-colors"
        >
          Conception & Développement <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-300 dark:via-indigo-200 dark:to-purple-300">
            d'applications Web High-Tech
          </span>
        </motion.h1>

        {/* Pitch / Description */}
        <motion.p
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-lg sm:text-xl text-white dark:text-white max-w-2xl leading-relaxed font-medium dark:font-normal transition-colors"
        >
          Développeur Full-Stack spécialisé dans les écosystèmes modernes et le déploiement Serverless Edge sur le réseau Cloudflare.
        </motion.p>

        {/* Boutons CTA Homogénéisés */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Bouton Principal (Référence) */}
          <Link
            href="/realisations"
            className={boutonClassName}
          >
            Découvrir nos réalisations
            <ArrowRight size={18} />
          </Link>

          {/* Bouton Secondaire (Aligné sur la même mécanique) */}
          <Link
            href="/contact"
            className={boutonClassName}
          >
            Nous contacter
            <Mail size={18} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

//export default Hero;