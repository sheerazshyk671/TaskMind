"use client"

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { AISuggestions } from './AISuggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, LayoutDashboard, CheckCircle2, ListTodo } from 'lucide-react';

export function TaskMindApp() {
  const { user } = useUser();
  const db = useFirestore();

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'tasks'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: tasks, isLoading } = useCollection(tasksQuery);

  const completedTasks = tasks?.filter(t => t.isCompleted).length || 0;
  const totalTasks = tasks?.length || 0;
  const totalSubtasks = tasks?.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0) || 0;
  const completedSubtasks = tasks?.reduce((acc, t) => acc + (t.subtasks?.filter((s: any) => s.isCompleted).length || 0), 0) || 0;

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto px-4 md:px-6">
      {/* Tasks Section */}
      <section className="space-y-6">
        <div className="bg-white/50 backdrop-blur-sm p-2 rounded-2xl border sticky top-4 z-10 shadow-sm">
          <TaskForm />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h3 className="font-headline font-bold text-lg">My Tasks</h3>
          </div>

          <ScrollArea className="h-[calc(100vh-320px)] rounded-md">
            <div className="space-y-3 pb-8">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : !tasks || tasks.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-muted-foreground/20">
                  <p className="text-muted-foreground">No tasks yet. Start by adding one above!</p>
                </div>
              ) : (
                tasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </section>

      {/* Progress Section */}
      <section className="bg-card p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-primary">
          <LayoutDashboard className="h-6 w-6" />
          <h2 className="text-xl font-headline font-bold">Your Progress</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Main Tasks</span>
              <span className="font-bold">{completedTasks} / {totalTasks}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Execution Progress</span>
              <span className="font-bold text-accent">{completedSubtasks} / {totalSubtasks}</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 ease-in-out"
                style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
              <ListTodo className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Focus</p>
              <p className="text-xl font-bold text-primary">{totalTasks - completedTasks}</p>
            </div>
            <div className="bg-accent/5 p-4 rounded-xl border border-accent/10 text-center">
              <CheckCircle2 className="h-4 w-4 text-accent mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Wins</p>
              <p className="text-xl font-bold text-accent-foreground">{completedTasks}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section>
        <AISuggestions existingTasks={tasks || []} />
      </section>
    </div>
  );
}
