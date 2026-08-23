// components/tech-marquee.tsx
import React from "react";
import { TECHNOLOGIES } from "@/content/technologies";

export default function TechMarquee() {
  // Duplication de la liste pour garantir un défilement infini sans interruption
  const duplicatedTechs = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section className="group w-full overflow-hidden rounded-xl bg-white dark:bg-blue-200 py-3 border border-black select-none cursor-pointer">
      <div className="flex w-max animate-marquee space-x-10">
        {duplicatedTechs.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-2.5 shrink-0"
            aria-hidden={index >= TECHNOLOGIES.length}
          >
            <img
              src={tech.logo}
              alt={tech.name}
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
            <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};