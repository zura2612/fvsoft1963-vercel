// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import JsonLd from "@/components/seo/json-ld";

// MODIFICATION : Import du ChatProvider pour partager l'état d'ouverture du chatbot globalement
import { ChatProvider } from "@/components/chat-context";
// MODIFICATION : Import du composant ChatBot pour le rendre disponible sur toutes les pages du site
import ChatBot from "@/components/chat-bot";

const inter = { className: 'font-sans' }; // Utilise la font système

export const metadata: Metadata = {
  metadataBase: new URL("https://fvsoft1963.com"),
  title: {
    default: "fvsoft1963 | Développeur Web & Full-Stack",
    template: "%s | fvsoft1963",
  },
  description:
    "Site vitrine et portfolio d'ingénierie logicielle. Conception d'applications web modernes sur Next.js et Cloudflare.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "fvsoft1963 | Développeur Web & Full-Stack",
    description:
      "Conception d'applications web modernes sur Next.js et Cloudflare.",
    url: "https://fvsoft1963.com",
    siteName: "fvsoft1963",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* MODIFICATION : Enveloppement de la structure principale avec ChatProvider pour que le Header et le ChatBot partagent le même état */}
          <ChatProvider>
            <Header />
            
            <main className="flex-1 py-2 sm:py-4">{children}</main>
            
            <Footer />

            {/* Intégration globale des Toasts (Sonner) */}
            <Toaster position="top-right" duration={5000} richColors closeButton />
            
            {/* MODIFICATION : Rendu global du ChatBot en fin de body, flottant au-dessus de toutes les pages */}
            <ChatBot />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}