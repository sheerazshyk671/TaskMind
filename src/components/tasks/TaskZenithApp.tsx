"use client"

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, LayoutDashboard } from 'lucide-react';

export function TaskZenithApp() {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      {/* Sidebar/Stats Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <h2 className="text-xl font-headline font-bold">Your Progress</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out" 
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</p>
                <p className="text-2xl font-bold text-primary">{totalTasks}</p>
              </div>
              <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Done</p>
                <p className="text-2xl font-bold text-accent-foreground">{completedTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Task List Section */}
      <div className="lg:col-span-8 space-y-6">
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
      </div>
    </div>
  );
}
