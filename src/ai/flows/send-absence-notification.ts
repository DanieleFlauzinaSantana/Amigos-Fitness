
// src/ai/flows/send-absence-notification.ts
'use server';
/**
 * @fileOverview Sends absence notifications to students who have missed multiple classes.
 *
 * - sendAbsenceNotification - A function that sends absence notifications to students.
 * - SendAbsenceNotificationInput - The input type for the sendAbsenceNotification function.
 * - SendAbsenceNotificationOutput - The return type for the sendAbsenceNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendAbsenceNotificationInputSchema = z.object({
  studentName: z.string().describe('O nome do aluno.'),
  studentId: z.string().describe('O ID do aluno.'),
  lastAttendanceDate: z.string().describe('A última data em que o aluno frequentou a academia. Use o formato YYYY-MM-DD.'),
  missedClassesCount: z.number().describe('O número de aulas que o aluno faltou.'),
  gymName: z.string().describe('O nome da academia.'),
  gymContactInformation: z
    .string()
    .describe('As informações de contato da academia (telefone, email).'),
});
export type SendAbsenceNotificationInput = z.infer<typeof SendAbsenceNotificationInputSchema>;

const SendAbsenceNotificationOutputSchema = z.object({
  notificationMessage: z.string().describe('A mensagem a ser enviada ao aluno.'),
});
export type SendAbsenceNotificationOutput = z.infer<typeof SendAbsenceNotificationOutputSchema>;

export async function sendAbsenceNotification(input: SendAbsenceNotificationInput): Promise<SendAbsenceNotificationOutput> {
  return sendAbsenceNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendAbsenceNotificationPrompt',
  input: {schema: SendAbsenceNotificationInputSchema},
  output: {schema: SendAbsenceNotificationOutputSchema},
  prompt: `Você é um assistente prestativo que elabora mensagens personalizadas em português para alunos que faltaram a várias aulas na academia.

  Dadas as seguintes informações, crie uma mensagem para incentivar o aluno a retornar à academia.

  Nome do Aluno: {{{studentName}}}
  ID do Aluno: {{{studentId}}}
  Última Data de Presença: {{{lastAttendanceDate}}}
  Número de Aulas Perdidas: {{{missedClassesCount}}}
  Nome da Academia: {{{gymName}}}
  Informações de Contato da Academia: {{{gymContactInformation}}}

  A mensagem deve ser amigável, encorajadora e destacar os benefícios de retornar à academia. Também deve incluir as informações de contato da academia para quaisquer dúvidas ou preocupações. Sugira que o aluno entre em contato com a academia.
  Faça a mensagem soar humana e não robótica.
  A mensagem deve ter no máximo 200 caracteres.
  Gere a mensagem em português.
  `,
});

const sendAbsenceNotificationFlow = ai.defineFlow(
  {
    name: 'sendAbsenceNotificationFlow',
    inputSchema: SendAbsenceNotificationInputSchema,
    outputSchema: SendAbsenceNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

