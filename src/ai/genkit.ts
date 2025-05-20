import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure dotenv is configured for environments where Next.js might not automatically load .env for Genkit initialization
// (though Next.js >= 9.4 should load .env files by default for server-side code)
// For Genkit CLI specific runs (like genkit start), src/ai/dev.ts handles dotenv.
// For Next.js server-side execution, process.env.GOOGLE_API_KEY should be available if .env is loaded.

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
