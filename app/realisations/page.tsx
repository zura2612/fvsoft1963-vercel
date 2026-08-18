// app/realisations/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
//import { motion, useMotionValue, animate } from "framer-motion";
import { motion, useMotionValue, animate, Variants } from "framer-motion";
import { REALISATIONS } from "../../data/realisations";

// Variantes d'animation pour l'apparition séquentielle
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function RealisationsPage() {
  // 1. Verrou pour éviter tout mismatch d'hydratation SSR/Client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Extraction dynamique des 12 éléments (coverImage + images secondaires)
  const orbitalItems = useMemo(() => {
    return REALISATIONS.flatMap((item) => {
      const itemsList: Array<{ url: string; caption: string }> = [];

      // Ajout de l'image de couverture
      if (item.coverImage) {
        itemsList.push({
          url: item.coverImage,
          caption: "photo principale",
        });
      }

      // Ajout des images secondaires
      if (item.images && item.images.length > 0) {
        item.images.forEach((img, idx) => {
          const url = typeof img === "string" ? img : img?.url;
          const caption =
            typeof img === "object" && img?.caption
              ? img.caption
              : `${item.title}`;

          if (url && url !== item.coverImage) {
            itemsList.push({ url, caption });
          }
        });
      }

      return itemsList.map((imgObj, imgIndex) => ({
        id: `${item.slug}-${imgIndex}-${imgObj.url}`,
        title: item.title,
        image: imgObj.url,
        caption: imgObj.caption,
        slug: item.slug,
      }));
    }).filter((item) => item.image && item.image.trim() !== "");
  }, []);

  // --- LOGIQUE DU CARROUSEL ORBITAL ---
  const rotationAngle = useMotionValue(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    const unsubscribe = rotationAngle.on("change", (latest) => {
      setCurrentAngle(latest);
    });
    return () => unsubscribe();
  }, [rotationAngle]);

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      rotationAngle.set(rotationAngle.get() + 0.005);
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoRotating, rotationAngle]);

  const totalItems = orbitalItems.length || 1; // Évite la division par zéro

  const bringToFront = (index: number) => {
    setIsAutoRotating(false);
    const targetAngleOffset = -(index * ((2 * Math.PI) / totalItems)) + Math.PI / 2;
    const current = rotationAngle.get();
    const twoPi = 2 * Math.PI;
    let delta = (targetAngleOffset - (current % twoPi)) % twoPi;
    if (delta > Math.PI) delta -= twoPi;
    if (delta < -Math.PI) delta += twoPi;

    animate(rotationAngle, current + delta, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
  };

  const radiusX = 420; //largeur
  const radiusY = 110; //profondeur

  return (
    /* max-w-7xl: Plafonne la largeur du conteneur à 1280px (80rem)*/
    <main className="py-6 rounded-2xl px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white dark:bg-black">
      {/* 1. En-tête de la page */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          <span className="text-black dark:text-white">Nos </span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-300 dark:via-indigo-200 dark:to-purple-300">Réalisations</span>
        </h1>
        <p className="text-lg text-black dark:text-slate-300 max-w-2xl mx-auto">
          Découvrez une sélection d'applications web, d'interfaces réactives et d'architectures cloud personnalisées.
        </p>
      </motion.div>

      {/* 2. Grille des cartes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {REALISATIONS.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-black dark:border-white shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image de couverture */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  priority //Désactive le lazy-loading et injecte une balise <link rel="preload"> dans le <head> HTML du document
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Contenu textuel */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">
                  {item.shortDescription}
                </p>

                {/* Badges Stack technique */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton d'accès au détail */}
            <div className="p-6 pt-0 mt-auto">
              <Link
                href={`/realisations/${item.slug}`}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-indigo-500/20"
              >
                En voir plus
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <hr className="border-black dark:border-white my-12" />
      {/* 3. SECTION CARROUSEL ORBITAL 3D DYNAMIQUE */}
      {orbitalItems.length > 0 && (
        <section className="py-8 flex flex-col justify-center items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Vue d'ensemble dynamique
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Parcourez nos aperçus via la galerie interactive
            </p>
          </div>

          <div
            className="relative w-full max-w-5xl h-[300px] sm:h-[420px] flex items-center justify-center select-none"
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            {orbitalItems.map((item, index) => {
              const itemAngle = currentAngle + index * ((2 * Math.PI) / totalItems);
              const x = Math.cos(itemAngle) * radiusX;
              const y = Math.sin(itemAngle) * radiusY;
              const depth = Math.sin(itemAngle);

              const scale = 0.65 + 0.35 * ((depth + 1) / 2);
              const opacity = 0.35 + 0.65 * ((depth + 1) / 2);
              const zIndex = Math.round((depth + 1) * 50);
              const blur = Math.max(0, (1 - depth) * 2);

              return (
                <motion.div
                  key={item.id}
                  onClick={() => bringToFront(index)}
                  className="absolute w-[200px] sm:w-[240px] bg-white dark:bg-slate-900 rounded-2xl border border-black dark:border-white shadow-xl overflow-hidden cursor-pointer group transition-shadow duration-300"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `blur(${blur}px)`,
                  }}
                >
                  <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-2.5 left-3 bg-white dark:bg-black text-black dark:text-white font-bold text-xs drop-shadow-md">
                      {item.title}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.caption}
                    </span>
                    <Link
                      href={`/realisations/${item.slug}`}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Survolez pour figer • Cliquez sur un projet pour le ramener au premier plan
          </div>
        </section>
      )}

    </main>
  );
}