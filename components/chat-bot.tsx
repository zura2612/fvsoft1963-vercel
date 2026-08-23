// components/chat-box.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, RefreshCw, RotateCcw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! Je suis l'assistant virtuel. Comment puis-je vous aider dans votre projet web ?",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Défilement automatique vers le dernier message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend || isLoading) return;

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

    // Filtrage du message de bienvenue pour ne transmettre que l'historique réel à l'API
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
        // On lit le corps de la réponse UNE SEULE FOIS sous forme de texte
        const rawText = await response.text();
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

      /*while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });

        // Traitement des fragments au format Data Stream (ex: '0:"texte"') ou texte brut
        const processedChunk = rawChunk
          .split("\n")
          .map((line) => {
            if (line.startsWith("0:")) {
              try {
                return JSON.parse(line.slice(2));
              } catch {
                return line.slice(2);
              }
            }
            return line;
          })
          .join("");

        accumulatedContent += processedChunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }*/
      
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
      //console.error("chat-bot.tsx [ChatBot Client Error]:", err);
      const msg = err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);

    // Supprime l'éventuel dernier message assistant vide (créé lors d'un stream échoué)
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

  // MODIFICATION 6 : Fonction de réinitialisation manuelle de l'historique
  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      {/* Bouton d'ouverture/fermeture */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Fenêtre principale */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex h-[480px] w-[350px] flex-col rounded-xl border border-gray-200 bg-white shadow-2xl">
          {/* Entête avec bouton de réinitialisation */}
          {/*<div className="rounded-t-xl bg-blue-600 p-4 text-white">
            <h3 className="font-semibold text-sm">Assistant FVSOFT1963</h3>
          </div>*/}
          <div className="flex items-center justify-between rounded-t-xl bg-blue-600 p-4 text-white">
            <div>
              <h3 className="font-semibold text-sm">Assistant FVSOFT1963</h3>
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

          {/* Zone de messages */}
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

            {/* Encadré d'erreur */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-600 space-y-2">
                <p className="font-semibold">Une erreur est survenue!</p>
                {/*<p className="break-words">{error}</p>*/}
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 text-red-700 font-medium underline hover:text-red-800 focus:outline-none"
                >
                  <RefreshCw className="h-3 w-3" /> Réessayer
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t border-gray-100 p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ici..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-600 text-gray-800 placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
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