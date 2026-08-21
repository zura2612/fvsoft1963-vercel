// app/contact/contact-form.tsx
"use client";

import { useEffect, useRef } from "react"; // useRef pour capturer le noeud DOM du bouton de soumission
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, ContactFormData } from "@/lib/schemas/contact";
import { sendContactEmail } from "./actions";
import confetti from "canvas-confetti";

const styleLabel = "block text-sm text-black dark:text-white font-medium mb-2";
const styleInput = "w-full px-4 py-2.5 text-black dark:text-white rounded-xl border border-black dark:border-white bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none";
const styleTextarea = "w-full px-4 py-2.5 text-black dark:text-white rounded-xl border border-black dark:border-white bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none";
const styleButton = "w-full py-3 px-6 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors font-semibold shadow-md";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");
  // Création de la ref rattachée au bouton de soumission
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      sujet: "",
      message: "",
      website: "", // Honeypot
    },
  });

  // Injection du sujet passé en URL
  useEffect(() => {
    if (subjectParam) {
      //setValue("sujet", subjectParam, { validateStatus: true });
      setValue("sujet", subjectParam, { shouldValidate: true });
    }
  }, [subjectParam, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    const res = await sendContactEmail(data);

    if (res.success) {
      toast.success("Votre message a bien été envoyé !");
      // code pour l'animation confetti
      // Calcul dynamique du centre du bouton en valeurs relatives (0 à 1)
      let originX = 0.5;
      let originY = 0.5;
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // X = (gauche du bouton + moitié de sa largeur) / largeur totale du viewport
        originX = (rect.left + rect.width / 2) / window.innerWidth;
        // Y = (haut du bouton + moitié de sa hauteur) / hauteur totale du viewport
        originY = (rect.top + rect.height / 2) / window.innerHeight;
      }
      
      confetti({
        particleCount: 200, // Nombre de confettis
        spread: 90, // Angle de l'explosion
        origin: { x: originX , y: originY }, // Positions sur l'écran exprimées en proportion de sa hauteur et largeur
        colors: [
          "#4f46e5", // Indigo principal (équivalent au bg-indigo-600 de Tailwind)
          "#818cf8", // Indigo plus clair pour le contraste
          "#312e81", // Indigo foncé
          "#ef4444", // Rouge vif
          "#dc2626", // Rouge foncé
          "#eab308", // Jaune
          "#facc15", // Jaune lumineux
          "#ffffff", // Blanc pour apporter de la luminosité
        ],
      });
      reset();
    } else {
      toast.error(res.error || "Une erreur est survenue lors de l'envoi.", { duration: 10000 });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Champ Honeypot masqué aux humains pour l'antispam */}
      {/* aria-hidden masque le champ aux lecteurs d'écran tabIndex empêche la touche Tab d'y accéder */}
      <div className="hidden" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Prénom */}
        <div>
          <label className={styleLabel}>Prénom *</label>
          <input
            {...register("prenom")}
            className={styleInput}
          />
          {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
        </div>

        {/* Nom */}
        <div>
          <label className={styleLabel}>Nom *</label>
          <input
            {...register("nom")}
            className={styleInput}
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className={styleLabel}>E-mail *</label>
          <input
            type="email"
            {...register("email")}
            className={styleInput}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label className={styleLabel}>Téléphone</label>
          <input
            type="tel"
            {...register("telephone")}
            className={styleInput}
          />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
        </div>
      </div>

      {/* Sujet */}
      <div>
        <label className={styleLabel}>Sujet *</label>
        <input
          {...register("sujet")}
          className={styleInput}
        />
        {errors.sujet && <p className="text-red-500 text-xs mt-1">{errors.sujet.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label className={styleLabel}>Message *</label>
        <textarea
          rows={5}
          {...register("message")}
          className={styleTextarea}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {/* Bouton de soumission */}
      {/* Liaison de buttonRef au composant HTML via l'attribut ref */}
      <button
        ref={buttonRef}
        type="submit"
        disabled={isSubmitting}
        className={styleButton}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}