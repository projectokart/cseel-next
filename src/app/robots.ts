import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    '/user/',
    '/student/',
    '/teacher/',
    '/org/',
    '/my-project/',
    '/admin/',
    '/system-admin-portal/',
    '/api/',
  ];

  // Explicit AI Search & Retrieval Bots list (ChatGPT, Gemini, Claude, Perplexity, Apple Intelligence, etc.)
  const aiSearchBots = [
    '*',
    'Googlebot',
    'Bingbot',
    'GPTBot',             // OpenAI model training & retrieval
    'OAI-SearchBot',      // ChatGPT Search Engine live web crawler
    'ChatGPT-User',       // ChatGPT live browsing actions
    'Google-Extended',    // Google Gemini & Vertex grounding
    'GoogleOther',        // Google auxiliary crawler
    'anthropic-ai',       // Anthropic Claude training & search
    'ClaudeBot',          // Claude crawler
    'Claude-Web',         // Claude live web browsing
    'PerplexityBot',      // Perplexity AI Search Engine
    'Applebot',           // Apple Search
    'Applebot-Extended',  // Apple Intelligence
    'cohere-ai',          // Cohere Search & LLMs
    'Meta-ExternalAgent', // Meta Llama / Meta AI
    'Diffbot',            // Diffbot Knowledge Graph
    'Bytespider',         // ByteDance AI
  ];

  return {
    rules: aiSearchBots.map((bot) => ({
      userAgent: bot,
      allow: '/',
      disallow: disallowedPaths,
    })),
    sitemap: 'https://www.cseel.org/sitemap.xml',
    host: 'https://www.cseel.org',
  };
}
