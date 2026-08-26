// app/page.tsx
import TechMarquee from "@/components/tech-marquee";
import Hero from "@/components/hero";
import Services from "@/components/services";
//import WelcomeToast from "@/components/welcome-toast";
import WelcomeModal from "@/components/welcome-modal";

export default function HomePage() {
  return (
    <main className="py-5 border border-black dark:border-white rounded-2xl px-4 sm:px-6 mx-auto max-w-7xl bg-blue-200 dark:bg-black flex flex-col gap-2 md:gap-4">

      {/* Fenêtre de bienvenue (se ferme au bout de 5 secondes) */}
      <WelcomeModal duration={5} />
    
      {/* Section TechMarquee */}
      <TechMarquee />
      
      {/* Section Hero */}
      <Hero />
      
      {/* Section Services */}
      <Services />    
    </main>
  );
}