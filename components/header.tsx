// components/header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

// MODIFICATION : Import du contexte pour contrôler l'ouverture du chatbot depuis le header
import { useChatContext } from "./chat-context";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Réalisations", href: "/realisations" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // MODIFICATION : Récupération de la fonction setIsOpen du contexte du chat
  const { setIsOpen: setChatOpen } = useChatContext();

  // MODIFICATION : Fonction dédiée pour ouvrir le chat. 
  // Si le chat est déjà ouvert, définir isOpen à true est un "no-op" pour React (rien ne se passe), respectant votre contrainte.
  const handleOpenChat = () => {
    setChatOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black dark:border-white bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Logo avec favicon */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Image
            src="/favicon.ico"
            alt={siteConfig.name}
            width={30}
            height={30}
            className="w-6 h-6 shrink-0 rounded-sm"
          />
          <span>
            {siteConfig.nom_entreprise.prefix}
            <span className="text-blue-600 dark:text-blue-500">
              {siteConfig.nom_entreprise.suffix}
            </span>
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                }`}
              >
                {link.name}
              {/*  {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-5.25 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )} */}
              </Link>
            );
          })}
          
          {/* MODIFICATION : Ajout du bouton "Aide" stylisé exactement comme les autres liens de navigation (texte uniquement) */}
          <button
            onClick={handleOpenChat}
            className="relative text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
          >
            Aide
          </button>
        </nav>

        {/* Actions (Thème + Menu Mobile) */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            aria-label="Menu de navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Mobile */}
      {isOpen && (
        <nav className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {link.name}
            </Link>
          ))}
          
          {/* MODIFICATION : Ajout du bouton "Aide" dans le menu mobile avec le même style, fermant le menu et ouvrant le chat */}
          <button
            onClick={() => {
              setIsOpen(false);
              handleOpenChat();
            }}
            className="block w-full text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
          >
            Aide
          </button>
        </nav>
      )}
    </header>
  );
}