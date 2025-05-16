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
  studentName: z.string().describe('The name of the student.'),
  studentId: z.string().describe('The ID of the student.'),
  lastAttendanceDate: z.string().describe('The last date the student attended the gym. Use format YYYY-MM-DD.'),
  missedClassesCount: z.number().describe('The number of classes the student has missed.'),
  gymName: z.string().describe('The name of the gym.'),
  gymContactInformation: z
    .string()
    .describe('The contact information of the gym (phone number, email).'),
});
export type SendAbsenceNotificationInput = z.infer<typeof SendAbsenceNotificationInputSchema>;

const SendAbsenceNotificationOutputSchema = z.object({
  notificationMessage: z.string().describe('The message to be sent to the student.'),
});
export type SendAbsenceNotificationOutput = z.infer<typeof SendAbsenceNotificationOutputSchema>;

export async function sendAbsenceNotification(input: SendAbsenceNotificationInput): Promise<SendAbsenceNotificationOutput> {
  return sendAbsenceNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendAbsenceNotificationPrompt',
  input: {schema: SendAbsenceNotificationInputSchema},
  output: {schema: SendAbsenceNotificationOutputSchema},
  prompt: `You are a helpful assistant that crafts personalized messages to students who have missed multiple classes at the gym.

  Given the following information, create a message to encourage the student to return to the gym.

  Student Name: {{{studentName}}}
  Student ID: {{{studentId}}}
  Last Attendance Date: {{{lastAttendanceDate}}}
  Missed Classes Count: {{{missedClassesCount}}}
  Gym Name: {{{gymName}}}
  Gym Contact Information: {{{gymContactInformation}}}

  The message should be friendly, encouraging, and highlight the benefits of returning to the gym. It should also include the gym's contact information for any questions or concerns. Suggest the student contact the gym.
  Make the message sound human and not robotic.
  The message should have at most 200 characters.
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
