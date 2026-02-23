"use client"

import React, { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function TaskForm() {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { user } = useUser();
  const db = useFirestore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !user || !db) return;

    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    addDocumentNonBlocking(tasksRef, {
      userId: user.uid,
      description: description.trim(),
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      dueDate: date ? date.toISOString() : null,
      priority: 'medium'
    });
    
    setDescription('');
    setDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="flex-1 flex gap-2">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 h-12 text-base rounded-xl border-2 focus-visible:ring-primary shadow-sm"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "h-12 w-12 sm:w-auto px-3 rounded-xl border-2 font-normal text-muted-foreground",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className={cn("h-5 w-5", date && "text-primary")} />
              <span className="hidden sm:inline ml-2">
                {date ? format(date, "PPP") : "Set deadline"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        type="submit" 
        className="h-12 w-full sm:w-12 rounded-xl shadow-lg bg-primary hover:bg-primary/90"
        disabled={!description.trim()}
      >
        <Plus className="h-6 w-6" />
        <span className="sm:hidden ml-2 font-bold">Add Task</span>
      </Button>
    </form>
  );
}
