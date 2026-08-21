// app/realisations/page.tsx
import Image from "next/image";
import Link from "next/link";
import { REALISATIONS } from "@/lib/data/realisations";
import OrbitalGalleryLoader from "./orbital-gallery-loader";

export const dynamic = "force-static";

export default function RealisationsPage() {
  return (
    <main className="py-10 border border-black dark:border-white rounded-2xl px-4 sm:px-6 mx-auto max-w-7xl bg-white dark:bg-black">
      {/* 1. En-tête de la page */}
      <div className="text-center mb-16">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-black dark:text-white">Nos </span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-300 dark:via-indigo-200 dark:to-purple-300">
            Réalisations
          </span>
        </h1>
        <p className="text-lg text-black dark:text-slate-300 max-w-2xl mx-auto">
          Découvrez une sélection d&apos;applications web, d&apos;interfaces réactives
          et d&apos;architectures cloud personnalisées.
        </p>
      </div>

      {/* 2. Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {REALISATIONS.map((item, index) => (
          <article
            key={item.id}
            className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-black dark:border-white shadow-md hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image de couverture */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  priority={index === 0}
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
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <hr className="border-black dark:border-white my-12" />

      {/* 3. Galerie orbitale chargée côté client uniquement */}
      <OrbitalGalleryLoader />
    </main>
  );
}