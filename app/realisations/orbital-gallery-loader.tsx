// app/realisations/orbital-gallery-loader.tsx
"use client";

import dynamic from "next/dynamic";

const OrbitalGallery = dynamic(() => import("./orbital-gallery"), {
  ssr: false,
  loading: () => (
    <section className="py-8 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Chargement de la galerie interactive…
      </p>
    </section>
  ),
});

export default function OrbitalGalleryLoader() {
  return <OrbitalGallery />;
}