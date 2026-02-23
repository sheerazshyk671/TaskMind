'use server';
/**
 * @fileOverview An AI assistant that suggests new task ideas and identifies the most important focus based on a user's existing tasks.
 *
 * - suggestTasks - A function that handles the task suggestion process.
 * - SuggestedTasksInput - The input type for the suggestTasks function.
 * - SuggestedTasksOutput - The return type for the suggestTasks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestedTasksInputSchema = z.object({
  existingTasks: z.array(z.string()).describe('A list of pending, incomplete tasks that the AI should analyze.'),
});
export type SuggestedTasksInput = z.infer<typeof SuggestedTasksInputSchema>;

const SuggestedTasksOutputSchema = z.object({
  suggestedTasks: z.array(z.string()).describe('A list of new task ideas suggested by the AI.'),
  priorityTask: z.object({
    task: z.string().describe('The most important task to focus on first.'),
    directions: z.string().describe('Step-by-step guidance on how to achieve this task.'),
    reasoning: z.string().describe('Brief explanation of why this task is the priority.'),
  }).describe('The single most important task the user should focus on right now.'),
});
export type SuggestedTasksOutput = z.infer<typeof SuggestedTasksOutputSchema>;

export async function suggestTasks(input: SuggestedTasksInput): Promise<SuggestedTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: { schema: SuggestedTasksInputSchema },
  output: { schema: SuggestedTasksOutputSchema },
  prompt: `You are an AI assistant for the 'TaskMind' application. 
  Your goal is to help users organize their tasks and stay productive.

  Analyze the following list of pending (incomplete) tasks:
  {{#if existingTasks}}
  {{#each existingTasks}}- {{this}}
  {{/each}}
  {{else}}
  (The list is currently empty)
  {{/if}}

  Your tasks:
  1. Identify the "Zenith Focus": Choose the single most important task for the user to work on next from the pending list. If the list is empty, suggest a high-impact starting task. Provide clear, step-by-step directions on how to complete it and a brief reasoning why it was chosen.
  2. Suggest 3-5 new tasks: Provide relevant follow-up tasks or new ideas that would complement the existing list or help the user reach their goals.

  Be concise, practical, and helpful.

  Suggested New Tasks and Priority Focus:`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestedTasksInputSchema,
    outputSchema: SuggestedTasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
