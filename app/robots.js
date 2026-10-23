import { DOMAIN } from '@/lib/routes';

export const dynamic = 'force-static';

// Search engines and AI assistants are welcome.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: DOMAIN + '/sitemap.xml',
  };
}
