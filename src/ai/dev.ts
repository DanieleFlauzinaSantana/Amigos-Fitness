import { config } from 'dotenv';
config();

import '@/ai/flows/send-absence-notification.ts';
import '@/ai/flows/predict-dropout.ts';