'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme = 'system' } = useTheme();

  return (
    <SonnerToaster
      position="top-center"
      theme={theme as 'light' | 'dark' | 'system'}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-sans)',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) - 2px)',
          boxShadow: 'var(--shadow-md)',
          padding: '12px 16px',
        },
        classNames: {
          toast: 'group',
          title: 'font-medium text-foreground',
          description: 'text-sm text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
        },
      }}
    />
  );
}
