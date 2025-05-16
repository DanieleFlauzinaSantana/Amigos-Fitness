
// src/ai/flows/predict-dropout.ts
'use server';
/**
 * @fileOverview Predicts potential early dropouts based on attendance and profile data,
 * and optionally, feedback from their latest satisfaction survey.
 *
 * - predictDropout - Function to predict dropout risk.
 * - PredictDropoutInput - Input type for predictDropout function.
 * - PredictDropoutOutput - Output type for predictDropout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SurveyFeedbackForAI } from '@/lib/types'; // Importando o tipo

const PredictDropoutInputSchema = z.object({
  attendanceRecords: z
    .array(z.object({date: z.string(), attended: z.boolean()}))
    .describe('Array of attendance records with date and attendance status.'),
  profileData: z
    .object({
      age: z.number(),
      fitnessGoals: z.string(),
      membershipType: z.string(),
      engagementLevel: z.string().optional(),
    })
    .describe('User profile data including age, fitness goals, and membership type.'),
  surveyFeedback: z.object({
      overallSatisfaction: z.number().min(1).max(5).optional().describe('Overall satisfaction score from 1 (very dissatisfied) to 5 (very satisfied).'),
      likelihoodToRecommend: z.string().optional().describe('Likelihood to recommend the gym (e.g., Sim, Não, Talvez).'),
      comments: z.string().optional().describe('Open-ended comments from the survey.'),
    }).optional().describe('Feedback from the latest student satisfaction survey, if available.')
});
export type PredictDropoutInput = z.infer<typeof PredictDropoutInputSchema>;

const PredictDropoutOutputSchema = z.object({
  dropoutRisk: z
    .number()
    .describe(
      'A value between 0 and 1 indicating the risk of dropout, with 1 being the highest risk.'
    ),
  reasons: z.array(z.string()).describe('Reasons for the predicted dropout risk.'),
  recommendations: z
    .array(z.string())
    .describe('Recommendations to mitigate the dropout risk.'),
});
export type PredictDropoutOutput = z.infer<typeof PredictDropoutOutputSchema>;

export async function predictDropout(input: PredictDropoutInput): Promise<PredictDropoutOutput> {
  return predictDropoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDropoutPrompt',
  input: {schema: PredictDropoutInputSchema},
  output: {schema: PredictDropoutOutputSchema},
  prompt: `You are an AI assistant that helps gym managers predict if a student will drop out and provides recommendations to prevent it.

  Analyze the following attendance records, profile data, and survey feedback (if available) to predict the dropout risk. Provide reasons for your prediction and recommendations to mitigate the risk.

  Attendance Records:
  {{#each attendanceRecords}}
  - Date: {{this.date}}, Attended: {{this.attended}}
  {{/each}}

  Profile Data:
  - Age: {{profileData.age}}
  - Fitness Goals: {{profileData.fitnessGoals}}
  - Membership Type: {{profileData.membershipType}}
  {{#if profileData.engagementLevel}}
  - Engagement Level: {{profileData.engagementLevel}}
  {{/if}}

  {{#if surveyFeedback}}
  Latest Survey Feedback:
  {{#if surveyFeedback.overallSatisfaction}}
  - Overall Satisfaction (1-5): {{surveyFeedback.overallSatisfaction}}
  {{/if}}
  {{#if surveyFeedback.likelihoodToRecommend}}
  - Likelihood to Recommend: {{surveyFeedback.likelihoodToRecommend}}
  {{/if}}
  {{#if surveyFeedback.comments}}
  - Comments: "{{surveyFeedback.comments}}"
  {{/if}}
  {{/if}}

  Based on this information, determine the dropoutRisk (a value between 0 and 1), reasons, and recommendations.
  Consider low satisfaction or negative comments in the survey as potential indicators of increased dropout risk.
  `,
});

const predictDropoutFlow = ai.defineFlow(
  {name: 'predictDropoutFlow', inputSchema: PredictDropoutInputSchema, outputSchema: PredictDropoutOutputSchema},
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
