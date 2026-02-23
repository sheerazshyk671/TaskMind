"use client"

import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/layout/Navbar';
import { TaskMindApp } from '@/components/tasks/TaskMindApp';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, loading, signInWithGoogle, signInGuest } = useAuth();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {user ? (
          <TaskMindApp />
        ) : (
          <div className="py-12 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Now with AI suggestions
                </div>
                <h1 className="text-5xl lg:text-7xl font-headline font-extrabold tracking-tight text-foreground leading-tight">
                  Reach the <span className="text-primary italic">Zenith</span> of Productivity.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  TaskMind is more than a list. It's an AI-powered partner that helps you focus, 
                  organize, and achieve your most important goals with ease.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={signInWithGoogle}
                    className="h-14 px-8 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={signInGuest}
                    className="h-14 px-8 text-lg font-bold rounded-2xl border-2 hover:bg-secondary/50"
                  >
                    View Demo
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Easy Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">AI Suggestions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Secure & Private</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden border">
                  <Image 
                    src={PlaceHolderImages.find(img => img.id === 'hero-productivity')?.imageUrl || 'https://picsum.photos/seed/taskmind/1200/600'} 
                    alt="TaskMind App Workspace" 
                    width={1200}
                    height={600}
                    className="rounded-[2rem] object-cover"
                    data-ai-hint="productivity workspace"
                  />
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Goal Achieved!</p>
                      <p className="text-[10px] text-muted-foreground">Weekly tasks complete</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">AI Tip</p>
                      <p className="text-[10px] text-muted-foreground">Try delegating task #4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-8 mt-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-8 bg-primary/20 rounded-lg flex items-center justify-center px-1">
              <span className="text-primary font-bold text-sm">TM</span>
            </div>
            <span className="font-headline font-bold tracking-tight text-foreground">
              TaskMind
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear || '...'} Sheeraz Ahmed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
