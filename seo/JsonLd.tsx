// seo/JsonLd.tsx
export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "fvauchot",
    "url": "https://fvsoft1963.com",
    "jobTitle": "Développeur Informatique Full-Stack",
    "knowsAbout": ["React", "Next.js", "TypeScript", "Cloudflare", "Développement Web"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://fvsoft1963.com/contact"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}