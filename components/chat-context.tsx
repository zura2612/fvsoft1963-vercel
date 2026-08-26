// components/chat-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext doit être utilisé à l'intérieur d'un ChatProvider");
  }
  return context;
}