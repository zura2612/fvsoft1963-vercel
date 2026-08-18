// app/realisations/[slug]/page.tsx
import { notFound } from "next/navigation";
import { REALISATIONS } from "../../../data/realisations";
import RealisationDetailClient from "./RealisationDetailClient";

// Génération des routes statiques pour le build (SEO & performances optimales)
export async function generateStaticParams() {
  return REALISATIONS.map((realisation) => ({
    slug: realisation.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RealisationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const realisation = REALISATIONS.find((item) => item.slug === slug);

  if (!realisation) {
    notFound();
  }

  return <RealisationDetailClient realisation={realisation} />;
}