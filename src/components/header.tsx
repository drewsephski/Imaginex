'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';
import { Sparkles, CreditCard, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserStats {
  creditsUsed: number;
  creditsRemaining: number;
  tier: string;
  totalGenerations: number;
  lastGenerationAt: string | null;
}

export function Header() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded) return; // Wait for Clerk to load
      
      if (!isSignedIn) {
        setIsLoading(false);
        setUserStats(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized - possibly session expired
            router.push('/sign-in');
            return;
          }
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch user data');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setUserStats(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isSignedIn, isLoaded, getToken, router]);

  // Get credits display text with loading and error states
  const getCreditsDisplay = () => {
    if (!isLoaded) return 'Loading...';
    if (!isSignedIn) return 'Sign in to see credits';
    if (isLoading) return 'Loading...';
    if (error || !userStats) return 'Error loading credits';
    return `${userStats.creditsUsed}/${userStats.creditsRemaining + userStats.creditsUsed}`;
  };

  // Get subscription tier with fallback
  const getTierDisplay = () => {
    if (!isLoaded || isLoading) return 'Loading...';
    if (!isSignedIn) return 'Free';
    if (error || !userStats) return 'Unknown';
    return userStats.tier.toLowerCase();
  };

  if (!isLoaded) {
    return (
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-4">
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                ImagineX
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            {isSignedIn && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {getTierDisplay()}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{getCreditsDisplay()}</span>
                  </div>
                </div>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {isSignedIn && (
                <Link 
                  href="/dashboard" 
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/templates" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link 
                href="/pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {isSignedIn && (
                <div className="pt-2 mt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan:</span>
                    <Badge variant="outline" className="capitalize">
                      {getTierDisplay()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Credits:</span>
                    <div className="flex items-center space-x-1 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{getCreditsDisplay()}</span>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}