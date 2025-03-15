
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'neo';
}

export default function Card({ 
  children, 
  className, 
  hoverable = false,
  variant = 'default' 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variant === 'default' && 'bg-card border border-border shadow-sm',
        variant === 'glass' && 'glass-panel',
        variant === 'neo' && 'neo-panel',
        hoverable && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('font-medium text-lg', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-3', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 bg-muted/50 flex items-center', className)}>
      {children}
    </div>
  );
}
