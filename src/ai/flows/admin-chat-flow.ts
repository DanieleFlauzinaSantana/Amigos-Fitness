
// src/ai/flows/admin-chat-flow.ts
'use server';
/**
 * @fileOverview Um fluxo de chat para o administrador interagir com a IA.
 *
 * - adminChat - Uma função que recebe a mensagem do usuário e retorna a resposta da IA.
 * - AdminChatInput - O tipo de entrada para a função adminChat.
 * - AdminChatOutput - O tipo de retorno para a função adminChat.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminChatInputSchema = z.object({
  userMessage: z.string().describe('A mensagem ou pergunta do usuário administrador.'),
});
export type AdminChatInput = z.infer<typeof AdminChatInputSchema>;

const AdminChatOutputSchema = z.object({
  aiResponse: z.string().describe('A resposta da IA para o administrador.'),
});
export type AdminChatOutput = z.infer<typeof AdminChatOutputSchema>;

export async function adminChat(input: AdminChatInput): Promise<AdminChatOutput> {
  return adminChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminChatPrompt',
  input: {schema: AdminChatInputSchema},
  output: {schema: AdminChatOutputSchema},
  prompt: `Você é um assistente de IA prestativo, especializado em ajudar administradores de academias de ginástica com o software Amigos Fitness e com questões gerais sobre gestão de academias, retenção de alunos, marketing, bem-estar e engajamento de clientes.

  O administrador da academia ("usuário") fará perguntas ou pedirá conselhos. Responda de forma clara, concisa e útil, em português.

  Aqui está a mensagem do usuário:
  "{{{userMessage}}}"

  Forneça sua melhor resposta ou conselho.
  Se a pergunta for sobre o software Amigos Fitness, forneça informações precisas sobre suas funcionalidades (Gerenciamento de Alunos, Check-in, Previsão de Desistência com IA, Notificações de Ausência, Pesquisas de Satisfação, Configurações do Sistema).
  Se for uma questão geral sobre gestão de academias, ofereça insights práticos.
  Se for uma pergunta fora do seu escopo de conhecimento, admita educadamente que não pode ajudar com aquele tópico específico, mas tente direcionar para onde o administrador poderia encontrar ajuda, se possível.
  Mantenha um tom profissional e amigável.
  `,
});

const adminChatFlow = ai.defineFlow(
  {
    name: 'adminChatFlow',
    inputSchema: AdminChatInputSchema,
    outputSchema: AdminChatOutputSchema,
  },
  async (input: AdminChatInput) => {
    const {output} = await prompt(input);
    if (!output) {
      // Isso não deveria acontecer se o prompt estiver configurado corretamente com outputSchema
      return {aiResponse: "Desculpe, não consegui processar sua solicitação no momento."};
    }
    return output;
  }
);
