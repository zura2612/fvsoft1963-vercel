// content/technologies.ts
export type Technology = {
  name: string;
  logo: string;
};

export const TECHNOLOGIES: Technology[] = [
  { name: "Cal.com", logo: "/images/logos_svg/cal-com.svg" },
  { name: "Cloudflare", logo: "/images/logos_svg/cloudflare.svg" },
  { name: "Next.js", logo: "/images/logos_svg/nextjs.svg" },
  { name: "Node.js", logo: "/images/logos_svg/nodejs.svg" },
  { name: "React", logo: "/images/logos_svg/react.svg" },
  { name: "Tailwind CSS", logo: "/images/logos_svg/tailwindcss.svg" },
  { name: "Tanstack", logo: "/images/logos_svg/tanstack.svg" },  
  { name: "TypeScript", logo: "/images/logos_svg/typescript.svg" },
  { name: "Vercel", logo: "/images/logos_svg/vercel.svg" },
  { name: "Vite", logo: "/images/logos_svg/vite.svg" },
  { name: "Workos.com", logo: "/images/logos_svg/workos.svg" },
   // Ajoute tes autres fichiers SVG présents dans public/images/logos_svg/
];