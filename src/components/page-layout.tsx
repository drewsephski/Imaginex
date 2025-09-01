import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';

type PageLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export function PageLayout({ children, title, description, className = '' }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className={className}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
