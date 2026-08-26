// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const response = NextResponse.next();

  // Si le cookie n'existe pas, on le génère et on l'ajoute à la réponse
  if (!sessionId) {
    const newSessionId = crypto.randomUUID();
    response.cookies.set({
      name: 'session_id',
      value: newSessionId,
      httpOnly: true, // Empêche l'accès via JavaScript (sécurité XSS)
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
      sameSite: 'lax', // Protection CSRF standard
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: '/',
    });
  }

  return response;
}

// Appliquer le middleware uniquement aux routes API du chat
export const config = {
  matcher: '/api/chat/:path*',
};