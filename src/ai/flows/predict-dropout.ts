
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
import type { SurveyFeedbackForAI } from '@/lib/types';


const PredictDropoutInputSchema = z.object({
  attendanceRecords: z
    .array(z.object({date: z.string(), attended: z.boolean()}))
    .describe('Array de registros de frequência com data e status de presença.'),
  profileData: z
    .object({
      age: z.number(),
      fitnessGoals: z.string(),
      membershipType: z.string(),
      engagementLevel: z.string().optional(), // Nível de engajamento pode ser adicionado no futuro
      genderIdentity: z.string().optional().describe('Identidade de gênero do aluno (ex: "feminino", "masculino").'),
      likesWinter: z.string().optional().describe('Se o aluno gosta do inverno (ex: "sim", "nao").'),
    })
    .describe('Dados do perfil do usuário incluindo idade, objetivos de fitness, tipo de plano, identidade de gênero e se gosta do inverno.'),
  surveyFeedback: z.object({
      overallSatisfaction: z.number().optional().describe('Nível de satisfação geral do aluno (1-5), sendo 1 muito insatisfeito e 5 muito satisfeito.'),
      wouldRecommend: z.string().optional().describe('Se o aluno recomendaria a academia (sim/nao).'), // Pode ser "sim" ou "nao"
      comments: z.string().optional().describe('Comentários ou sugestões do aluno da pesquisa de satisfação.'),
    }).optional().describe('Feedback da última pesquisa de satisfação respondida pelo aluno. Considere este feedback como um fator importante.'),
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

  Analise os seguintes registros de frequência, dados do perfil e, MUITO IMPORTANTE, o feedback da pesquisa de satisfação (se disponível) para prever o risco de desistência. Forneça motivos para sua previsão e recomendações para mitigar o risco.

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
  {{#if profileData.genderIdentity}}
  - Identidade de Gênero: {{profileData.genderIdentity}}
  {{/if}}
  {{#if profileData.likesWinter}}
  - Gosta do Inverno: {{profileData.likesWinter}}
  {{/if}}

  {{#if surveyFeedback}}
  Feedback da Pesquisa de Satisfação (CONSIDERE ESTE FEEDBACK CUIDADOSAMENTE):
  {{#if surveyFeedback.overallSatisfaction}}
  - Satisfação Geral (1-5, sendo 5 o melhor): {{surveyFeedback.overallSatisfaction}}
  {{/if}}
  {{#if surveyFeedback.wouldRecommend}}
  - Recomendaria a Academia: {{surveyFeedback.wouldRecommend}}
  {{/if}}
  {{#if surveyFeedback.comments}}
  - Comentários Adicionais: "{{surveyFeedback.comments}}"
  {{/if}}
  {{else}}
  - Nenhuma resposta à pesquisa de satisfação foi fornecida.
  {{/if}}

  Com base nessas informações, determine o dropoutRisk (um valor entre 0 e 1), os motivos (reasons) e as recomendações (recommendations).
  Gere as razões e recomendações em português.

  FATORES IMPORTANTES PARA CONSIDERAR COM MAIOR PESO NO RISCO DE DESISTÊNCIA:
  1. Feedback da pesquisa: Se o feedback da pesquisa for predominantemente negativo (baixa satisfação, não recomendaria, comentários negativos), isso deve AUMENTAR SIGNIFICATIVAMENTE o risco de desistência. Se for positivo, pode diminuir ou manter, dependendo dos outros fatores. Se não houver feedback da pesquisa, baseie a análise nos outros dados.
  2. Padrões de frequência: Longas ausências ou frequência decrescente são indicadores importantes de risco.
  3. Perfil específico:
     - Se 'profileData.genderIdentity' for "feminino", pode haver uma ligeira tendência a maior risco de desistência se outros fatores negativos estiverem presentes (como baixa frequência ou feedback ruim). Considere isso com sensibilidade e como um fator a mais na análise combinada.
     - Se 'profileData.likesWinter' for "nao", isso pode indicar uma maior propensão à desistência durante períodos mais frios ou de menor motivação. Aumente um pouco o risco se outros indicadores negativos estiverem presentes.

  O feedback da pesquisa é um indicador crucial do sentimento do aluno; dê o peso apropriado a ele.
  Combine todos os fatores para uma análise holística.
  `,
});

const predictDropoutFlow = ai.defineFlow(
  {name: 'predictDropoutFlow', inputSchema: PredictDropoutInputSchema, outputSchema: PredictDropoutOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
