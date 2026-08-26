// components/chat-box.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
// MODIFICATION 1 : Ajout de l'icône AlertCircle pour illustrer visuellement l'avertissement de limite de requêtes atteinte.
import { MessageSquare, X, Send, Loader2, RefreshCw, RotateCcw, AlertCircle } from "lucide-react";
// MODIFICATION 2 : Import du contexte personnalisé pour synchroniser l'état d'ouverture/fermeture avec le Header.
import { useChatContext } from "./chat-context";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! Je suis l'assistant virtuel. Comment puis-je vous aider dans l'utilisation du site ?",
};

export default function ChatBot() {
  // MODIFICATION 3 : Suppression du useState local pour isOpen. Utilisation du contexte global à la place.
  const { isOpen, setIsOpen } = useChatContext();
  //const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // MODIFICATION 4 : Ajout d'un état dédié pour gérer le compte à rebours en cas d'erreur HTTP 429 (Too Many Requests).
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // MODIFICATION 5 : Ajout de 'timeLeft' aux dépendances pour garantir que le défilement vers le bas s'ajuste même pendant le décompte.
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, timeLeft]);

  // MODIFICATION 6 : Nouveau hook useEffect pour gérer le décompte automatique des secondes restantes avant le déblocage de l'interface.
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      setTimeLeft(null);
      setError(null); // On lève l'erreur générique quand le temps est écoulé
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendMessage = async (overrideText?: string) => {
    // MODIFICATION 7 : Empêche l'envoi d'une nouvelle requête si le client est actuellement en période de blocage (rate limit) ou en cours de chargement.
    if (timeLeft !== null || isLoading) return;

    const textToSend = (overrideText || input).trim();
    if (!textToSend) return;

    setError(null);
    setInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const history = updatedMessages
      .filter((m) => m.id !== "welcome")
      .map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        let messageErreur = `Erreur HTTP ${response.status}`;
        const rawText = await response.text();
        
        // MODIFICATION 8 : Gestion spécifique et prioritaire de l'erreur HTTP 429 (Rate Limit) avant de traiter les autres erreurs.
        if (response.status === 429) {
          let waitTime = 60; // Valeur par défaut de sécurité en secondes
          
          // MODIFICATION 9 : Lecture de l'en-tête standard HTTP 'Retry-After' en priorité, avec fallback sur le corps JSON de la réponse.
          const retryAfterHeader = response.headers.get("Retry-After");
          if (retryAfterHeader) {
            waitTime = parseInt(retryAfterHeader, 10);
          } else {
            try {
              const errorData = JSON.parse(rawText);
              if (errorData.retryAfter) waitTime = errorData.retryAfter;
              if (errorData.error) messageErreur = errorData.error;
            } catch {
              if (rawText.trim()) messageErreur = rawText;
            }
          }
          
          // MODIFICATION 10 : Activation du compte à rebours et levée d'une erreur contextuelle pour l'utilisateur.
          setTimeLeft(waitTime);
          throw new Error(`Limite de requêtes atteinte. Veuillez patienter ${waitTime} secondes.`);
        }

        // Gestion des autres erreurs (400, 500, etc.)
        try {
          const errorData = JSON.parse(rawText);
          if (errorData.error) messageErreur = errorData.error;
        } catch {
          if (rawText.trim()) messageErreur = rawText;
        }
        throw new Error(messageErreur);
      }

      if (!response.body) {
        throw new Error("Le flux de réponse du serveur est vide.");
      }

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
           
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      if (!accumulatedContent.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        throw new Error("Réponse vide reçue de la part du modèle.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue.";
      
      // MODIFICATION 11 : On ne définit l'état d'erreur générique que si nous ne sommes pas déjà en train de gérer un compte à rebours (429).
      if (timeLeft === null) {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // MODIFICATION 12 : Sécurisation de la fonction de réessai pour empêcher tout clic intempestif pendant la période de blocage.
    if (timeLeft !== null) return;
    
    setError(null);
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === "assistant" && !last.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content);
    }
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setInput("");
    // MODIFICATION 13 : Réinitialisation explicite du compteur de temps lors d'un reset manuel du chat par l'utilisateur.
    setTimeLeft(null); 
  };

  // MODIFICATION 14 : Création d'une variable dérivée pour centraliser la logique de désactivation des champs de saisie (chargement OU blocage).
  const isDisabled = isLoading || timeLeft !== null;

  return (
    <div className="fixed bottom-6 right-2 z-[9999] font-sans">
      <button
        type="button"
        // MODIFICATION 15 : Le bouton d'ouverture/fermeture utilise désormais la fonction setIsOpen du contexte global.
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 flex h-[480px] w-[350px] flex-col rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-xl bg-blue-600 p-4 text-white">
            <div>
              <h3 className="font-semibold text-sm">Assistant virtuel de FVSOFT1963</h3>
            </div>
            <button
              type="button"
              onClick={resetChat}
              title="Réinitialiser la conversation"
              aria-label="Réinitialiser la conversation"
              className="rounded p-1 hover:bg-blue-700 transition-colors focus:outline-none"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                L'assistant écrit...
              </div>
            )}

            {/* MODIFICATION 16 : Remplacement de l'encadré d'erreur unique par un rendu conditionnel : affichage spécifique pour le rate limit (429), et affichage classique pour les autres erreurs. */}
            {timeLeft !== null ? (
              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Trop de requêtes</p>
                    <p>Pour garantir la qualité du service, veuillez patienter <span className="font-bold">{timeLeft}</span> secondes avant de poser une nouvelle question.</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-600 space-y-2">
                <p className="font-semibold">Une erreur est survenue</p>
                <p className="break-words">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 text-red-700 font-medium underline hover:text-red-800 focus:outline-none"
                >
                  <RefreshCw className="h-3 w-3" /> Réessayer
                </button>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="border-t border-gray-100 p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // MODIFICATION 17 : Désactivation du champ de saisie et changement dynamique du placeholder pendant la période de blocage ou de chargement.
              placeholder={isDisabled ? "Patientez..." : "Posez votre question ici..."}
              disabled={isDisabled}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-600 text-gray-800 placeholder:text-gray-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              // MODIFICATION 18 : Utilisation de la variable 'isDisabled' pour désactiver le bouton d'envoi de manière cohérente avec le champ de saisie.
              disabled={isDisabled || !input.trim()}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}