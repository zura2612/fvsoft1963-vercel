// app/contact/page.tsx
import { Suspense } from "react";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black rounded-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl text-black dark:text-white font-extrabold mb-3">Contactez-nous</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Une question ou un projet en tête ? Envoyez-nous un message.
        </p>
        {/* Mention des champs obligatoires */}
        <p className="text-xs text-black dark:text-white mt-3">
          Les champs marqués d'un astérisque (<span className="font-semibold">*</span>) sont obligatoires.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-10">Chargement du formulaire...</div>}>
        <ContactForm /> {/* utilise useSearchParams() => enveloppé par Suspense */}
      </Suspense>
    </main>
  );
}