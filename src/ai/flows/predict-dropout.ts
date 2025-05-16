
// src/ai/flows/predict-dropout.ts
'use server';
/**
 * @fileOverview Predicts potential early dropouts based on attendance and profile data.
 * Responde em português.
 *
 * - predictDropout - Function to predict dropout risk.
 * - PredictDropoutInput - Input type for predictDropout function.
 * - PredictDropoutOutput - Output type for predictDropout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDropoutInputSchema = z.object({
  attendanceRecords: z
    .array(z.object({date: z.string(), attended: z.boolean()}))
    .describe('Array de registros de frequência com data e status de presença.'),
  profileData: z
    .object({
      age: z.number(),
      fitnessGoals: z.string(),
      membershipType: z.string(),
      engagementLevel: z.string().optional(),
    })
    .describe('Dados do perfil do usuário incluindo idade, objetivos de fitness e tipo de plano.'),
  // surveyFeedback foi removido pois as respostas agora estão no Google Forms.
});
export type PredictDropoutInput = z.infer<typeof PredictDropoutInputSchema>;

const PredictDropoutOutputSchema = z.object({
  dropoutRisk: z
    .number()
    .describe(
      'Um valor entre 0 e 1 indicando o risco de desistência, sendo 1 o maior risco.'
    ),
  reasons: z.array(z.string()).describe('Motivos para o risco de desistência previsto, em português.'),
  recommendations: z
    .array(z.string())
    .describe('Recomendações para mitigar o risco de desistência, em português.'),
});
export type PredictDropoutOutput = z.infer<typeof PredictDropoutOutputSchema>;

export async function predictDropout(input: PredictDropoutInput): Promise<PredictDropoutOutput> {
  return predictDropoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDropoutPrompt',
  input: {schema: PredictDropoutInputSchema},
  output: {schema: PredictDropoutOutputSchema},
  prompt: `Você é um assistente de IA que ajuda gerentes de academia a prever se um aluno irá desistir e fornece recomendações para evitar isso. Responda em português.

  Analise os seguintes registros de frequência e dados do perfil para prever o risco de desistência. Forneça motivos para sua previsão e recomendações para mitigar o risco.

  Registros de Frequência:
  {{#each attendanceRecords}}
  - Data: {{this.date}}, Compareceu: {{this.attended}}
  {{/each}}

  Dados do Perfil:
  - Idade: {{profileData.age}}
  - Objetivos de Fitness: {{profileData.fitnessGoals}}
  - Tipo de Plano: {{profileData.membershipType}}
  {{#if profileData.engagementLevel}}
  - Nível de Engajamento: {{profileData.engagementLevel}}
  {{/if}}

  Com base nessas informações, determine o dropoutRisk (um valor entre 0 e 1), os motivos (reasons) e as recomendações (recommendations).
  Gere as razões e recomendações em português.
  `,
});

const predictDropoutFlow = ai.defineFlow(
  {name: 'predictDropoutFlow', inputSchema: PredictDropoutInputSchema, outputSchema: PredictDropoutOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
