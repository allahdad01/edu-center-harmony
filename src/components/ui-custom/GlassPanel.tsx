
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

export default function GlassPanel({ 
  children, 
  className,
  intensity = 'medium'
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all',
        intensity === 'light' && 'bg-white/40 backdrop-blur-md border-white/10',
        intensity === 'medium' && 'bg-white/60 backdrop-blur-lg border-white/20',
        intensity === 'heavy' && 'bg-white/80 backdrop-blur-xl border-white/30',
        'dark:bg-slate-900/60 dark:border-slate-800/50 dark:backdrop-blur-lg',
        'shadow-glass hover:shadow-glass-hover',
        className
      )}
    >
      {children}
    </div>
  );
}
