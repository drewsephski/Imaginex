'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  CreditCard, 
  Download, 
  Share2, 
  Trash2, 
  Plus,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Loader2,
  Wand2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  width: number;
  height: number;
  creditsUsed: number;
  createdAt: string;
}

interface UserStats {
  creditsUsed: number;
  creditsRemaining: number;
  tier: string;
  totalGenerations: number;
  lastGenerationAt: string | null;
}

export default function Dashboard() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserData();
      fetchGenerations();
    } else if (isLoaded && !isSignedIn) {
      // Redirect to sign-in if not authenticated
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const { data } = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const fetchGenerations = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/user/generations?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }
        throw new Error('Failed to fetch generations');
      }

      const { data } = await response.json();
      setGenerations(data.generations);
    } catch (error) {
      console.error('Failed to fetch generations:', error);
      toast.error('Failed to load generations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (generationId: string) => {
    setDeletingId(generationId);
    try {
      const token = await getToken();
      const response = await fetch(`/api/user/generations?id=${generationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete generation');
      }

      setGenerations(prev => prev.filter(gen => gen.id !== generationId));
      toast.success('Generation deleted successfully');
    } catch (error) {
      console.error('Failed to delete generation:', error);
      toast.error('Failed to delete generation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imaginex-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: prompt,
          url: imageUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard!');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect from useEffect
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load user data. Please try refreshing the page.</p>
            <Button 
              onClick={fetchUserData} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const creditsUsedPercentage = (userStats.creditsUsed / (userStats.creditsUsed + userStats.creditsRemaining)) * 100;
  const totalCredits = userStats.creditsUsed + userStats.creditsRemaining;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {clerkUser?.firstName || 'User'}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.creditsUsed}</div>
              <p className="text-xs text-muted-foreground">
                of {totalCredits} total credits
              </p>
              <Progress value={creditsUsedPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{userStats.tier}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.creditsRemaining} credits remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
              <Wand2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalGenerations}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.lastGenerationAt 
                  ? `Last generation on ${new Date(userStats.lastGenerationAt).toLocaleDateString()}`
                  : 'No generations yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Generations</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <Link href="/generate">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Generation
              </Button>
            </Link>
          </div>

          <TabsContent value="recent" className="mt-0">
            {generations.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No generations yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new image.</p>
                <div className="mt-6">
                  <Link href="/generate">
                    <Button>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Create New Image
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generations.map((generation) => (
                  <Card key={generation.id} className="overflow-hidden">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={generation.imageUrl}
                        alt={generation.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p className="text-white text-sm line-clamp-2">{generation.prompt}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(generation.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {generation.creditsUsed} credit{generation.creditsUsed !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDownload(generation.imageUrl, generation.prompt)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleShare(generation.imageUrl, generation.prompt)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={deletingId === generation.id}
                              >
                                {deletingId === generation.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this generation. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(generation.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="text-center py-12 border rounded-lg">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
              <p className="mt-1 text-sm text-gray-500">Click the heart icon on any generation to add it to favorites.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}