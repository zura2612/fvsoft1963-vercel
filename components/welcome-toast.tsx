// components/welcome-toast.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeToastProps {
  /** Durée d'affichage en secondes (par défaut : 5 secondes) */
  duration?: number;
}

export default function WelcomeToast({ duration = 5 }: WelcomeToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Déclenche la fermeture au bout de `duration` secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration * 1000);

    // Nettoyage du timer si le composant est démonte prématurément
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full bg-blue-600/90 dark:bg-blue-500/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-md border border-blue-400/40 dark:border-blue-300/30 flex items-center justify-between gap-3 text-sm font-medium"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base" role="img" aria-label="wave">
              👋
            </span>
            <span>bienvenue sur le site de fvsoft1963</span>
          </div>

          {/* Bouton de fermeture manuelle */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            aria-label="Fermer la notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}