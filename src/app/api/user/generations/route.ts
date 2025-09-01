import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  width: number;
  height: number;
  creditsUsed: number;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's generations with pagination
    const generations = await prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        prompt: true,
        imageUrl: true,
        width: true,
        height: true,
        creditsUsed: true,
        createdAt: true,
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.generation.count({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      data: {
        generations: generations.map(gen => ({
          ...gen,
          createdAt: gen.createdAt.toISOString(),
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + generations.length < totalCount,
        },
      },
    });
    
  } catch (error) {
    console.error('Error fetching generations:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch generations',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('id');

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    // Verify the generation belongs to the user
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      select: { userId: true }
    });

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    if (generation.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the generation
    await prisma.generation.delete({
      where: { id: generationId }
    });

    return NextResponse.json({
      success: true,
      message: 'Generation deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting generation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete generation',
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
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}