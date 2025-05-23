import { config } from 'dotenv';
config(); // Carrega variáveis do .env para process.env

import '@/ai/flows/send-absence-notification.ts';
import '@/ai/flows/predict-dropout.ts';
import '@/ai/flows/admin-chat-flow.ts'; // Adiciona o novo fluxo de chat
