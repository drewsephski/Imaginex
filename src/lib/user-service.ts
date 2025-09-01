import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { SubscriptionTier } from '@prisma/client';

interface UserStats {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  creditsUsed: number;
  creditsRemaining: number;
  tier: SubscriptionTier;
  totalGenerations: number;
  lastGenerationAt: Date | null;
}

export async function getCurrentUserFromDB() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  try {
    // First try to get the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '', // Will be updated via webhook
          name: 'New User',
          subscription: 'FREE',
          creditsUsed: 0,
          creditsLimit: 10, // Default free tier credits
        },
        include: {
          generations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              createdAt: true
            }
          }
        }
      });
    }

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Get user with subscription and generations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate usage stats
    const [totalGenerations, creditsUsed] = await Promise.all([
      prisma.generation.count({ where: { userId } }),
      prisma.generation.aggregate({
        where: { userId },
        _sum: { creditsUsed: true }
      })
    ]);

    return {
      id: user.id,
      email: user.email || '',
      name: user.name,
      imageUrl: user.imageUrl,
      creditsUsed: creditsUsed._sum.creditsUsed || 0,
      creditsRemaining: Math.max(0, user.creditsLimit - (creditsUsed._sum.creditsUsed || 0)),
      tier: user.subscription,
      totalGenerations,
      lastGenerationAt: user.generations[0]?.createdAt || null
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

export async function updateUserCredits(userId: string, creditsToAdd: number) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      creditsUsed: {
        increment: creditsToAdd,
      },
    },
  });
}

export async function getUserGenerations(userId: string, limit = 20) {
  return await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

interface SaveGenerationParams {
  userId: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  imageSize: string;
  style?: string;
  width: number;
  height: number;
  seed?: number;
  modelUsed?: string;
  creditsUsed?: number;
}

export async function saveGeneration(data: SaveGenerationParams) {
  return await prisma.generation.create({
    data: {
      userId: data.userId,
      prompt: data.prompt,
      negativePrompt: data.negativePrompt,
      imageUrl: data.imageUrl,
      imageSize: data.imageSize,
      style: data.style,
      width: data.width,
      height: data.height,
      seed: data.seed,
      modelUsed: data.modelUsed || 'fal-ai/flux/schnell',
      creditsUsed: data.creditsUsed || 1,
    },
  });
}

export async function deleteGeneration(userId: string, generationId: string) {
  return await prisma.generation.deleteMany({
    where: {
      id: generationId,
      userId: userId,
    },
  });
}