
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Plus, RefreshCcw, Target, Lightbulb } from 'lucide-react';
import { suggestTasks, SuggestedTasksOutput } from '@/ai/flows/ai-suggested-tasks-flow';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AISuggestionsProps {
  existingTasks: any[];
}

export function AISuggestions({ existingTasks }: AISuggestionsProps) {
  const [aiResult, setAiResult] = useState<SuggestedTasksOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const getSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Filter out completed tasks so the AI only analyzes what's left to do
      const pendingTasks = existingTasks.filter(t => !t.isCompleted);
      const taskList = pendingTasks.map(t => t.description);
      
      const response = await suggestTasks({ existingTasks: taskList });
      setAiResult(response);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate insights.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (!user || !db) return;
    
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    addDocumentNonBlocking(tasksRef, {
      userId: user.uid,
      description: suggestion,
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      priority: 'medium'
    });

    if (aiResult) {
      setAiResult({
        ...aiResult,
        suggestedTasks: aiResult.suggestedTasks.filter(s => s !== suggestion)
      });
    }
    
    toast({ title: 'Success', description: 'Task added from suggestions.' });
  };

  return (
    <Card className="border-accent/20 bg-accent/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent fill-accent" />
            AI Intelligence
          </CardTitle>
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/20">
            TaskMind Focus
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!aiResult ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Lightbulb className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
              Analyze your tasks to get a prioritized roadmap and actionable steps.
            </p>
          </div>
        ) : (
          <>
            {/* Priority Task Section - Restored Focus & Roadmap */}
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Zenith Focus</h4>
              </div>
              <div className="bg-card p-4 rounded-xl border-l-4 border-l-primary shadow-sm space-y-2">
                <p className="text-sm font-bold text-foreground">
                  {aiResult.priorityTask.task}
                </p>
                <p className="text-[11px] text-muted-foreground italic">
                  "{aiResult.priorityTask.reasoning}"
                </p>
                <Separator className="my-2" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-primary uppercase">Execution Plan:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {aiResult.priorityTask.directions}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested New Tasks Section */}
            {aiResult.suggestedTasks.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Suggested Actions</h4>
                </div>
                <div className="grid gap-2">
                  {aiResult.suggestedTasks.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-card/50 p-3 rounded-lg border border-accent/10 hover:border-accent/30 transition-colors group"
                    >
                      <span className="text-xs font-medium truncate flex-1 pr-2">{suggestion}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="h-7 w-7 text-accent hover:text-accent hover:bg-accent/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={getSuggestions} 
          disabled={isGenerating}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/10"
        >
          {isGenerating ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Focus...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {aiResult ? "Refresh Analysis" : "Analyze Tasks"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
