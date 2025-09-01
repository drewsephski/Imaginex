import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the current user from Clerk to ensure the session is valid
    const userFromClerk = await currentUser();
    if (!userFromClerk) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create user in the database
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

    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: userFromClerk.emailAddresses[0]?.emailAddress || '',
          name: userFromClerk.firstName && userFromClerk.lastName 
            ? `${userFromClerk.firstName} ${userFromClerk.lastName}`
            : userFromClerk.username || 'New User',
          subscription: 'FREE',
          creditsUsed: 0,
          creditsLimit: 10, // Default free tier credits
          imageUrl: userFromClerk.imageUrl || null,
        },
        include: {
          generations: true
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          creditsUsed: user.creditsUsed,
          creditsRemaining: Math.max(0, user.creditsLimit - user.creditsUsed),
          tier: user.subscription,
          totalGenerations: 0,
          lastGenerationAt: null
        }
      });
    }

    // Update user data from Clerk if needed
    if (userFromClerk && (
      user.email !== userFromClerk.emailAddresses[0]?.emailAddress ||
      user.name !== `${userFromClerk.firstName} ${userFromClerk.lastName}`.trim() ||
      user.imageUrl !== userFromClerk.imageUrl
    )) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: userFromClerk.emailAddresses[0]?.emailAddress || user.email,
          name: userFromClerk.firstName && userFromClerk.lastName 
            ? `${userFromClerk.firstName} ${userFromClerk.lastName}`
            : userFromClerk.username || user.name,
          imageUrl: userFromClerk.imageUrl || user.imageUrl,
        },
        include: {
          generations: true
        }
      });
    }

    // Calculate usage stats
    const [totalGenerations, creditsUsed] = await Promise.all([
      prisma.generation.count({ where: { userId: user.id } }),
      prisma.generation.aggregate({
        where: { userId: user.id },
        _sum: { creditsUsed: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl,
        creditsUsed: creditsUsed._sum?.creditsUsed || 0,
        creditsRemaining: Math.max(0, user.creditsLimit - (creditsUsed._sum?.creditsUsed || 0)),
        tier: user.subscription,
        totalGenerations,
        lastGenerationAt: user.generations[0]?.createdAt || null
      }
    });
    
  } catch (error) {
    console.error('Error in user API route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch user data',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}