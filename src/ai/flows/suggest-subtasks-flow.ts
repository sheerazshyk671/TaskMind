
'use server';
/**
 * @fileOverview An AI assistant that suggests subtasks for a specific main task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestSubtasksInputSchema = z.object({
  taskDescription: z.string().describe('The description of the main task to break down.'),
});
export type SuggestSubtasksInput = z.infer<typeof SuggestSubtasksInputSchema>;

const SuggestSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('A list of 3-5 subtasks that break down the main goal.'),
});
export type SuggestSubtasksOutput = z.infer<typeof SuggestSubtasksOutputSchema>;

export async function suggestSubtasks(input: SuggestSubtasksInput): Promise<SuggestSubtasksOutput> {
  return suggestSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubtasksPrompt',
  input: { schema: SuggestSubtasksInputSchema },
  output: { schema: SuggestSubtasksOutputSchema },
  prompt: `You are an AI productivity assistant. 
  Your goal is to help users break down a complex task into small, manageable, and actionable subtasks.
  
  Main Task: {{{taskDescription}}}
  
  Your tasks:
  1. Suggest 3-5 logical subtasks that contribute to completing the main task.
  2. Keep each subtask concise and clear.
  
  Suggested Subtasks:`,
});

const suggestSubtasksFlow = ai.defineFlow(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestSubtasksInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
