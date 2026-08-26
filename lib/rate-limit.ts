// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Instance Redis réutilisée (singleton)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Stratégie "fixed window" :
 * 10 requêtes maximum par minute par session anonyme
 */
export const chatRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '60 s'),
  analytics: true, // Active les métriques pour le dashboard Upstash
  prefix: 'ratelimit:chat:anon',
});

/**
 * Stratégie alternative "sliding window" plus souple :
 * 60 requêtes maximum par heure
 */
export const hourlyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 h'),
  analytics: true,
  prefix: 'ratelimit:hourly',
});

/**
 * Stratégie "token bucket" pour limiter le volume de tokens :
 * utile pour contrôler les coûts API.
 * 
 * Signature de tokenBucket : (tauxDeRemplissage, intervalle, capaciteMaximale)
 * Ici : 10 000 tokens consommables par jour, avec un plafond maximal de 10 000.
 */
export const tokenBucketLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(10000, '1 d', 10000),
  analytics: true,
  prefix: 'ratelimit:tokens',
});