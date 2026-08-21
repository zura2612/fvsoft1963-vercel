// app/page.tsx

import Hero from "@/components/hero";
import Services from "@/components/services";
//<div className="container mx-auto flex flex-col border border-black px-4 sm:px-6 py-2 md:py-4 gap-2 md:gap-4">
export default function HomePage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2 md:gap-4 bg-white dark:bg-black rounded-2xl">
      {/* Section Hero */}
      <Hero />
      {/* Section Services */}
      <Services />
    </main>
  );
}