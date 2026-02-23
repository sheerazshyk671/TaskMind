
"use client"

import React, { useState } from 'react';
import { useUser, useFirestore, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, Calendar as CalendarIcon, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TaskItemProps {
  task: any;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [manualSubtaskDesc, setManualSubtaskDesc] = useState('');
  
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  if (!user || !db) return null;

  const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);

  const handleToggle = () => {
    updateDocumentNonBlocking(taskRef, { 
      isCompleted: !task.isCompleted,
      updatedAt: serverTimestamp()
    });
  };

  const handleDelete = () => {
    deleteDocumentNonBlocking(taskRef);
  };

  const handleSave = () => {
    if (!editedDescription.trim()) return;
    updateDocumentNonBlocking(taskRef, { 
      description: editedDescription.trim(),
      updatedAt: serverTimestamp()
    });
    setIsEditing(false);
  };

  const handleAddSubtask = (subtaskDesc: string) => {
    const currentSubtasks = task.subtasks || [];
    const newSubtask = {
      id: Math.random().toString(36).substring(2, 9),
      description: subtaskDesc,
      isCompleted: false
    };
    
    updateDocumentNonBlocking(taskRef, {
      subtasks: [...currentSubtasks, newSubtask],
      updatedAt: serverTimestamp()
    });
  };

  const handleManualAddSubtask = () => {
    if (!manualSubtaskDesc.trim()) return;
    handleAddSubtask(manualSubtaskDesc.trim());
    setManualSubtaskDesc('');
    toast({ title: 'Subtask added', description: 'Your breakdown has been updated.' });
  };

  const toggleSubtask = (subtaskId: string) => {
    const currentSubtasks = task.subtasks || [];
    const updatedSubtasks = currentSubtasks.map((s: any) => 
      s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    
    updateDocumentNonBlocking(taskRef, {
      subtasks: updatedSubtasks,
      updatedAt: serverTimestamp()
    });
  };

  const deleteSubtask = (subtaskId: string) => {
    const currentSubtasks = task.subtasks || [];
    const updatedSubtasks = currentSubtasks.filter((s: any) => s.id !== subtaskId);
    
    updateDocumentNonBlocking(taskRef, {
      subtasks: updatedSubtasks,
      updatedAt: serverTimestamp()
    });
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !task.isCompleted;

  return (
    <div className="task-item-enter bg-card rounded-xl border shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          {!isEditing && (
            <Checkbox 
              checked={task.isCompleted} 
              onCheckedChange={handleToggle}
              className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          )}
          
          {isEditing ? (
            <div className="flex-1 flex gap-2">
              <Input 
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="flex-1"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <Button size="icon" variant="ghost" onClick={handleSave} className="text-primary hover:text-primary hover:bg-primary/10">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-base font-semibold transition-all",
                  task.isCompleted ? "text-muted-foreground line-through opacity-60" : "text-foreground"
                )}>
                  {task.description}
                </span>
                {task.subtasks?.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                    {task.subtasks.filter((s: any) => s.isCompleted).length}/{task.subtasks.length}
                  </Badge>
                )}
              </div>
              {dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-[11px] mt-1",
                  isOverdue ? "text-destructive font-bold" : "text-muted-foreground"
                )}>
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    {isToday(dueDate) ? "Today" : format(dueDate, "MMM d, yyyy")}
                  </span>
                  {isOverdue && <span className="ml-1 uppercase tracking-tighter">(Overdue)</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="h-8 w-8 text-muted-foreground"
            >
              {showSubtasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Subtasks Section */}
      {showSubtasks && (
        <div className="px-4 pb-4 pt-0 space-y-3">
          <Separator className="opacity-50" />
          
          {/* Subtasks List */}
          {task.subtasks?.length > 0 && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/10">
              {task.subtasks.map((subtask: any) => (
                <div key={subtask.id} className="flex items-center justify-between group/subtask">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={subtask.isCompleted} 
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span className={cn(
                      "text-xs transition-colors",
                      subtask.isCompleted ? "text-muted-foreground line-through opacity-60" : "text-foreground"
                    )}>
                      {subtask.description}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteSubtask(subtask.id)}
                    className="h-6 w-6 opacity-0 group-hover/subtask:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Manual Add Subtask Input */}
          <div className="flex items-center gap-2 pl-4">
            <div className="relative flex-1">
              <Input 
                placeholder="Add subtask manually..." 
                value={manualSubtaskDesc}
                onChange={(e) => setManualSubtaskDesc(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualAddSubtask()}
                className="h-8 text-xs bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30 pl-2 pr-8"
              />
              {manualSubtaskDesc && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 absolute right-1 top-1 text-primary"
                  onClick={handleManualAddSubtask}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
