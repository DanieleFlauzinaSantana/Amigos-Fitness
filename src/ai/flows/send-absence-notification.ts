
// src/ai/flows/send-absence-notification.ts
'use server';
/**
 * @fileOverview Envia notificações de ausência personalizadas e acolhedoras para alunos.
 *
 * - sendAbsenceNotification - Uma função que gera mensagens de notificação de ausência.
 * - SendAbsenceNotificationInput - O tipo de entrada para a função sendAbsenceNotification.
 * - SendAbsenceNotificationOutput - O tipo de retorno para a função sendAbsenceNotification.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendAbsenceNotificationInputSchema = z.object({
  studentName: z.string().describe('O nome do aluno.'),
  studentId: z.string().describe('O ID do aluno.'),
  lastAttendanceDate: z.string().describe('A última data em que o aluno frequentou a academia. Use o formato YYYY-MM-DD.'),
  missedClassesCount: z.number().describe('O número de aulas que o aluno faltou.'),
  gymName: z.string().describe('O nome da academia (será substituído por "Academia Força Local" na mensagem).'),
  gymContactInformation: z
    .string()
    .describe('As informações de contato da academia (telefone, email).'),
  surveyLink: z.string().url().optional().describe('O link completo para a pesquisa de satisfação, se aplicável.'),
});
export type SendAbsenceNotificationInput = z.infer<typeof SendAbsenceNotificationInputSchema>;

const SendAbsenceNotificationOutputSchema = z.object({
  notificationMessage: z.string().describe('A mensagem SMS acolhedora a ser enviada ao aluno.'),
});
export type SendAbsenceNotificationOutput = z.infer<typeof SendAbsenceNotificationOutputSchema>;

export async function sendAbsenceNotification(input: SendAbsenceNotificationInput): Promise<SendAbsenceNotificationOutput> {
  return sendAbsenceNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendAbsenceNotificationPrompt',
  input: {schema: SendAbsenceNotificationInputSchema},
  output: {schema: SendAbsenceNotificationOutputSchema},
  prompt: `Você é um assistente de IA amigável e atencioso da Academia Força Local. Seu objetivo é criar mensagens SMS personalizadas e acolhedoras em PORTUGUÊS para alunos que têm faltado.

Dadas as seguintes informações:
Nome do Aluno: {{{studentName}}}
ID do Aluno: {{{studentId}}}
Última Data de Presença: {{{lastAttendanceDate}}}
Número de Aulas Perdidas: {{{missedClassesCount}}}
Nome da Academia a ser usado na mensagem: Academia Força Local
Informações de Contato da Academia: {{{gymContactInformation}}}
{{#if surveyLink}}
Link da Pesquisa de Satisfação: {{{surveyLink}}}
{{/if}}

Crie uma mensagem SMS curta (máximo 250 caracteres) e humana para o aluno:
- Comece com uma saudação calorosa e pessoal usando o nome do aluno (Ex: "Olá, {{{studentName}}}! Tudo bem?").
- Mencione que sentimos falta dele(a) na Academia Força Local.
- De forma leve e empática, pergunte se está tudo bem ou lembre-o(a) dos benefícios de manter a rotina de treinos (Ex: "Notamos sua ausência e queríamos saber se está tudo certo. Lembre-se que estamos aqui para te ajudar a manter o foco nos seus objetivos!").
- Se um {{{surveyLink}}} for fornecido, inclua-o de forma natural na mensagem. Ex: "Sua opinião é muito importante para nós! Que tal nos contar como podemos melhorar? Responda nossa pesquisa rápida: {{{surveyLink}}}".
- Se não houver link da pesquisa, foque na mensagem de reengajamento.
- Inclua o contato da academia ({{{gymContactInformation}}}) para que o aluno possa tirar dúvidas ou conversar.
- Evite qualquer tom de cobrança ou julgamento. O objetivo é ser solidário e incentivar o retorno.
- A mensagem DEVE ser em português brasileiro.
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
