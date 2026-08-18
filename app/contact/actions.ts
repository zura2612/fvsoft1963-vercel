// app/contact/actions.ts
"use server";

import { Resend } from "resend";
import { contactSchema, ContactFormData } from "@/lib/schemas/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: ContactFormData) {
  const emailTo = process.env.CONTACT_EMAIL_TO;

  // 1. Validation Runtime + Narrowing TypeScript automatique
  if (!emailTo) {
    console.error("action.ts ERREUR: La variable d'environnement CONTACT_EMAIL_TO n'est pas définie.");
    return { success: false, error: "Configuration serveur incomplète: CONTACT_EMAIL_TO inconnu" };
  }

  // 2. Validation robuste côté serveur
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Données de formulaire invalides." };
  }

  const { nom, prenom, email, telephone, sujet, message, website } = result.data;

  // 3. Traitement Anti-Spam Honeypot
  if (website && website.length > 0) {
    // Faux succès pour leurrer les bots sans consommer de quota Resend
    return { success: true };
  }

  // 4. Envoi via l'API Resend
  try {
    const { error } = await resend.emails.send({
      from: "FVSOFT1963 Contact <contact@notifications.fvsoft1963.com>", // Remplace par ton domaine vérifié en prod
      //to: [emailTo], pose problème avec next build?
      to: [emailTo],
      replyTo: email,
      subject: `[Contact FVSOFT1963] ${sujet}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Message de contact</h2>
          <p><strong>Expéditeur :</strong> ${prenom} ${nom}</p>
          <p><strong>E-mail :</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
          <p><strong>Sujet :</strong> ${sujet}</p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
          <h3>Message :</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; rounded: 8px;">${message}</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Erreur Resend :", err);
    return { success: false, error: "Impossible d'envoyer le message pour le moment." };
  }
}