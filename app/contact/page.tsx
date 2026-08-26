// app/contact/page.tsx
import { Suspense } from "react";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <section className="py-10 border border-black dark:border-white rounded-2xl px-4 sm:px-6 mx-auto max-w-7xl bg-blue-200 dark:bg-black rounded-2xl">
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
    </section>
  );
}