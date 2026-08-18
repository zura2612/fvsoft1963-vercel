// app/realisations/[slug]/RealisationDetailClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Realisation } from "../../../data/realisations";

interface Props {
  realisation: Realisation;
}

export default function RealisationDetailClient({ realisation }: Props) {
  // AJOUT : Remplacement du state 'selectedImage' par 'selectedImageIndex' pour gérer l'index actif
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // AJOUT : Fonction d'ouverture du Lightbox appelée au clic sur une vignette
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  // AJOUT : Fonction de fermeture centralisée du Lightbox
  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // MODIFICATION : Écouteur clavier pour fermer la Lightbox via 'Échap'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    /* Enveloppe 100% largeur avec gestion dynamique du fond jour/nuit */
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/realisations"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux réalisations
          </Link>
        </motion.div>

        {/* En-tête du projet */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {realisation.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
            {realisation.shortDescription}
          </p>

          {/* Badges de Stack technique */}
          <div className="flex flex-wrap gap-2 mb-6">
            {realisation.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Liens externes (Démo) */}
          {realisation.demoUrl && (
            <div className="pt-2">
              <a
                href={realisation.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Visiter le site en direct
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </motion.section>

        {/* Description Détaillée */}
        {realisation.fullDescription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-black dark:border-white shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">À propos de la réalisation</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {realisation.fullDescription}
            </p>
          </motion.section>
        )}

        {/* Galerie d'images sous forme de Vignettes (2 Colonnes) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Aperçu & Captures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {realisation.images && realisation.images.length > 0 ? (
              realisation.images.map((item, index) => {
                // Normalisation : supporte aussi bien string que { url, caption }
                const url = typeof item === "string" ? item : item?.url;
                const caption = typeof item === "object" && item?.caption ? item.caption : `Capture ${index + 1}`;

                // Sécurité : si l'URL est invalide ou vide, on n'affiche pas l'élément
                if (!url || url.trim() === "") return null;

                return (
                  <div
                    key={index}
                    // AJOUT : Attributs d'accessibilité (a11y) pour la navigation clavier
                    role="button"
                    tabIndex={0}
                    onClick={() => openLightbox(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openLightbox(index);
                      }
                    }}
                    className="group relative flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {/* Conteneur Image */}
                    <div className="relative w-full h-55 sm:h-70 overflow-hidden">
                      <Image
                        src={url}
                        alt={`${realisation.title} - ${caption}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Agrandir 🔍
                        </span>
                      </div>
                    </div>

                    {/* Légende sous l'image */}
                    {caption && (
                      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {caption}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 col-span-2">
                Aucune capture secondaire disponible pour ce projet.
              </p>
            )}
          </div>
        </motion.section>

        {/* MODIFICATION : Modale Lightbox Plein Écran adaptée pour 'selectedImageIndex' */}
        <AnimatePresence>
          {selectedImageIndex !== null && (() => {
            const activeItem = realisation.images[selectedImageIndex];
            const activeUrl = typeof activeItem === "string" ? activeItem : activeItem?.url;
            const activeCaption = typeof activeItem === "object" ? activeItem?.caption : "";

            if (!activeUrl) return null;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out"
              >
                <button
                  onClick={closeLightbox}
                  aria-label="Fermer la vue agrandie"
                  className="absolute top-6 right-6 text-white bg-slate-800/80 hover:bg-slate-700 p-3 rounded-full transition-colors z-10 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-6xl h-[75vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={activeUrl}
                    alt={activeCaption || "Vue agrandie"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>

                {/* AJOUT : Légende sous l'image dans la modale si disponible */}
                {activeCaption && (
                  <p className="mt-4 text-sm font-medium text-slate-200 text-center max-w-xl bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800 backdrop-blur-sm">
                    {activeCaption}
                  </p>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </main>
    </div>
  );
}