// lib/schemas/contact.ts
import { z } from "zod";

// critères de validité des saisies
export const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse e-mail invalide"),
  telephone: z.string().optional().refine((val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),"Numéro de téléphone invalide"),
  sujet: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  // Honeypot : doit impérativement rester vide
  website: z.string().max(0, "Bot détecté"),
});

export type ContactFormData = z.infer<typeof contactSchema>;