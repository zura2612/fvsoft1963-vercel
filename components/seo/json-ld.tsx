// components/seo/json-ld.tsx
export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "François Vauchot",
    "url": "https://fvsoft1963.com",
    "jobTitle": "Développeur Informatique Full-Stack",
    "description": "Ingénieur et développeur Full-Stack spécialisé dans les écosystèmes React, Next.js et l'infrastructure Cloudflare.",
    "knowsAbout": ["React", "Next.js", "TypeScript", "Cloudflare", "Développement Web", "SEO Technique"],
    "sameAs": ["https://linkedin.com/in/françois-vauchot-2781472b9", "https://github.com/zura2612"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://fvsoft1963.com/contact"
    }
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    </>
  );
}