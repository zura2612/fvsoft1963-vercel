// app/realisations/orbital-gallery.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue } from "framer-motion";
import { REALISATIONS } from "@/lib/data/realisations";

export default function OrbitalGallery() {
  const orbitalItems = useMemo(() => {
    return REALISATIONS.flatMap((item) => {
      const itemsList: Array<{ url: string; caption: string }> = [];

      if (item.coverImage) {
        itemsList.push({
          url: item.coverImage,
          caption: "photo principale",
        });
      }

      if (item.images && item.images.length > 0) {
        item.images.forEach((img) => {
          const url = typeof img === "string" ? img : img?.url;
          const caption =
            typeof img === "object" && img?.caption
              ? img.caption
              : item.title;

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

  const totalItems = orbitalItems.length || 1;

  const bringToFront = (index: number) => {
    setIsAutoRotating(false);

    const targetAngleOffset =
      -(index * ((2 * Math.PI) / totalItems)) + Math.PI / 2;

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

  const radiusX = 420;
  const radiusY = 110;

  if (orbitalItems.length === 0) {
    return null;
  }

  return (
    <section className="py-8 flex flex-col justify-center items-center">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Vue d&apos;ensemble dynamique
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Parcourez nos aperçus via la galerie interactive
        </p>
      </div>

      <div
        className="relative w-full max-w-5xl h-[300px] sm:h-[420px] flex items-center justify-center select-none overflow-hidden"
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

      <div className="mt-2 text-xs text-black dark:text-white flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        Survolez pour figer • Cliquez sur un projet pour le ramener au premier plan
      </div>
    </section>
  );
}